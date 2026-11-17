// 공유 상태: 낙관적 갱신 → 300ms 디바운스 저장 → 4초 폴링으로 다른 사람 변경 받기.
// 연결이 끊기면 마지막 화면(브라우저에 남긴 마지막 값)을 그대로 보여주고, 다시 연결되면 최신 값을 불러온다.
import { useSyncExternalStore } from 'react';
import { BOARD_IDS, PROFILES } from '../data';
import type { BoardId, BoardState } from '../data/types';
import * as api from './api';

export type Net = 'connecting' | 'online' | 'offline' | 'saving';
export interface State { boards: Record<BoardId, BoardState>; net: Net; lastSync: number; error: string }

const LS = 'twin:state:v1';
const keyOf = (b: BoardId) => 'mixer/' + b;

function defaults(): Record<BoardId, BoardState> {
  const o = {} as Record<BoardId, BoardState>;
  for (const b of BOARD_IDS) {
    const vals: Record<string, number> = {};
    PROFILES[b].controls.forEach((c) => { vals[c.id] = c.def; });
    o[b] = { vals, synced: {}, phantom: b === 'ag06' ? undefined : false, t: 0 };
  }
  return o;
}

function loadCache(): State['boards'] {
  const d = defaults();
  try {
    const raw = JSON.parse(localStorage.getItem(LS) || 'null');
    if (raw) for (const b of BOARD_IDS) if (raw[b]) d[b] = { ...d[b], ...raw[b], vals: { ...d[b].vals, ...raw[b].vals } };
  } catch { /* 저장소 없음: 기본값 */ }
  return d;
}

let state: State = { boards: loadCache(), net: 'connecting', lastSync: 0, error: '' };
const subs = new Set<() => void>();
function set(p: Partial<State>) {
  state = { ...state, ...p };
  try { localStorage.setItem(LS, JSON.stringify(state.boards)); } catch { /* 무시 */ }
  subs.forEach((f) => f());
}
export const getState = () => state;
export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => sel(state));
}

// ── 쓰기 ──
const pending = new Map<BoardId, number>();
const inflight = new Set<BoardId>();

function patchBoard(b: BoardId, f: (s: BoardState) => BoardState) {
  set({ boards: { ...state.boards, [b]: f(state.boards[b]) } });
  schedule(b);
}
export function setValue(b: BoardId, id: string, v: number) {
  patchBoard(b, (s) => ({ ...s, vals: { ...s.vals, [id]: v }, synced: { ...s.synced, [id]: false }, t: Date.now() }));
}
export function markSynced(b: BoardId, id: string) {
  patchBoard(b, (s) => ({ ...s, synced: { ...s.synced, [id]: true }, t: Date.now() }));
}
export function setPower(b: BoardId, on: boolean) {
  patchBoard(b, (s) => ({ ...s, power: on, t: Date.now() }));
}
export function setPhantom(b: BoardId, on: boolean) {
  patchBoard(b, (s) => ({ ...s, phantom: on, t: Date.now() }));
}

function schedule(b: BoardId) {
  clearTimeout(pending.get(b));
  pending.set(b, window.setTimeout(() => { pending.delete(b); void flush(b); }, 300));
}
async function flush(b: BoardId) {
  inflight.add(b);
  set({ net: 'saving' });
  try {
    await api.put(keyOf(b), state.boards[b]);
    set({ net: 'online', lastSync: Date.now(), error: '' });
  } catch (e) {
    set({ net: 'offline', error: String((e as Error).message || e) });
    window.setTimeout(() => schedule(b), 5000); // 재시도
  } finally { inflight.delete(b); }
}

// ── 읽기(폴링) ──
export async function pull() {
  try {
    const r = await api.getAll();
    const next = { ...state.boards };
    let changed = false;
    for (const b of BOARD_IDS) {
      const row = r.data[keyOf(b)];
      const v = row && (row.v as BoardState | null);
      if (!v || !v.vals) continue;
      if (pending.has(b) || inflight.has(b)) continue; // 내 변경이 먼저
      if ((v.t || 0) > (next[b].t || 0)) { next[b] = { ...next[b], ...v, vals: { ...next[b].vals, ...v.vals } }; changed = true; }
    }
    set({ ...(changed ? { boards: next } : {}), net: state.net === 'saving' ? 'saving' : 'online', lastSync: Date.now(), error: '' });
  } catch (e) {
    set({ net: 'offline', error: String((e as Error).message || e) });
  }
}

let timer = 0;
export function startSync(intervalMs = 4000) {
  const tick = () => { if (document.visibilityState === 'visible') void pull(); };
  tick();
  clearInterval(timer);
  timer = window.setInterval(tick, intervalMs);
  document.addEventListener('visibilitychange', tick);
  window.addEventListener('online', tick);
  window.addEventListener('offline', () => set({ net: 'offline' }));
}

/** 데이터 내보내기 (전략 문서 5장: 처음부터 JSON 내려받기) */
export function exportJson(): string {
  return JSON.stringify({ exportedAt: new Date().toISOString(), boards: state.boards }, null, 2);
}
