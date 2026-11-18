// 공유 상태: 낙관적 갱신 → 300ms 디바운스 저장 → 4초 폴링으로 다른 사람 변경 받기.
// 연결이 끊기면 마지막 화면(브라우저에 남긴 마지막 값)을 그대로 보여주고, 다시 연결되면 최신 값을 불러온다.
import { useSyncExternalStore } from 'react';
import { BOARD_IDS, PROFILES } from '../data';
import type { BoardId, BoardState } from '../data/types';
import * as api from './api';

export type Net = 'connecting' | 'online' | 'offline' | 'saving';
/** 배선(M5): 케이블 id → 꽂힌 단자 id. 시안 MobWiring의 state.cur 그대로. */
/** added: 사용자가 추가한 케이블, removed: 삭제한 기본 케이블 id */
export interface AddedCable { id: string; grp: string; from: string; fromDev: string; to: string; type: string; cls: 'xlr' | 'ts' | 'rca'; orig: string; note: string }
/** ap: 바뀐 연결을 홈 배선도에 반영할지 (2026-11-18 사용자 결정, 없으면 반영) */
/** ack: 확인한 변경 묶음(sig), ackCur: 확인할 때의 배선 = 노란 선 기준 (2026-11-18 사용자 결정) */
export interface WiringDoc { cur: Record<string, string | null>; at: string; t: number; added?: AddedCable[]; removed?: string[]; ap?: boolean; ack?: string; ackCur?: Record<string, string | null> | null }
/** 점검 주의 사항 '확인했어요' (항목 key → 확인 시각). 공유 키 `checks` */
export type ChecksDoc = { res: Record<string, number>; t: number };
export interface State { boards: Record<BoardId, BoardState>; wiring: WiringDoc | null; checks: ChecksDoc | null; net: Net; lastSync: number; error: string }

const LS = 'twin:state:v1';
const LS_W = 'twin:wiring:v1';
const WKEY = 'wiring';
const CKEY = 'checks';
const LS_C = 'twin:checks:v1';
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

function loadWiring(): WiringDoc | null {
  try { return JSON.parse(localStorage.getItem(LS_W) || 'null'); } catch { return null; }
}

function loadChecks(): ChecksDoc | null {
  try { return JSON.parse(localStorage.getItem(LS_C) || 'null'); } catch { return null; }
}

let state: State = { boards: loadCache(), wiring: loadWiring(), checks: loadChecks(), net: 'connecting', lastSync: 0, error: '' };
const subs = new Set<() => void>();
function set(p: Partial<State>) {
  state = { ...state, ...p };
  try { localStorage.setItem(LS, JSON.stringify(state.boards)); if (p.wiring) localStorage.setItem(LS_W, JSON.stringify(p.wiring)); if (p.checks) localStorage.setItem(LS_C, JSON.stringify(p.checks)); } catch { /* 무시 */ }
  subs.forEach((f) => f());
}
export const getState = () => state;
export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => sel(state));
}

// ── 배선 쓰기 ──
let wPending = 0, wInflight = false;
export function setWiring(cur: Record<string, string | null>, at: string, added: AddedCable[] = [], removed: string[] = [], ap = true, ack = '', ackCur: Record<string, string | null> | null = state.wiring?.ackCur ?? null) {
  set({ wiring: { cur, at, t: Date.now(), added, removed, ap, ack, ackCur } });
  clearTimeout(wPending);
  wPending = window.setTimeout(() => { wPending = 0; void flushWiring(); }, 300);
}
async function flushWiring() {
  wInflight = true;
  set({ net: 'saving' });
  try {
    await api.put(WKEY, state.wiring);
    set({ net: 'online', lastSync: Date.now(), error: '' });
  } catch (e) {
    set({ net: 'offline', error: String((e as Error).message || e) });
    wPending = window.setTimeout(() => { wPending = 0; void flushWiring(); }, 5000);
  } finally { wInflight = false; }
}

/** 배선 변경 확인 (점검 탭): 지금 배선을 실물에도 옮긴 것으로 보고 기준으로 삼는다 */
export function ackWiring(sig: string) {
  const w = state.wiring;
  if (!w) return;
  setWiring(w.cur, w.at, w.added || [], w.removed || [], w.ap !== false, sig, { ...w.cur });
}

// ── 점검 확인 쓰기 ──
let cPending = 0, cInflight = false;
export function setCheck(key: string, on: boolean) {
  const res = { ...(state.checks?.res || {}) };
  if (on) res[key] = Date.now(); else delete res[key];
  set({ checks: { res, t: Date.now() } });
  clearTimeout(cPending);
  cPending = window.setTimeout(() => { cPending = 0; void flushChecks(); }, 300);
}
async function flushChecks() {
  cInflight = true;
  set({ net: 'saving' });
  try {
    await api.put(CKEY, state.checks);
    set({ net: 'online', lastSync: Date.now(), error: '' });
  } catch (e) {
    set({ net: 'offline', error: String((e as Error).message || e) });
    cPending = window.setTimeout(() => { cPending = 0; void flushChecks(); }, 5000);
  } finally { cInflight = false; }
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
    const w = r.data[WKEY]?.v as WiringDoc | null | undefined;
    const wNew = w && w.cur && !wPending && !wInflight && (w.t || 0) > (state.wiring?.t || 0) ? { wiring: w } : {};
    const c = r.data[CKEY]?.v as ChecksDoc | null | undefined;
    const cNew = c && c.res && !cPending && !cInflight && (c.t || 0) > (state.checks?.t || 0) ? { checks: c } : {};
    set({ ...wNew, ...cNew, ...(changed ? { boards: next } : {}), net: state.net === 'saving' ? 'saving' : 'online', lastSync: Date.now(), error: '' });
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
  return JSON.stringify({ exportedAt: new Date().toISOString(), boards: state.boards, wiring: state.wiring, checks: state.checks }, null, 2);
}
