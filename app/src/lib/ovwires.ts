// 홈 배선도의 케이블을 배선 데이터(wiring.cur)로 그린다 (2026-11-18 사용자 결정, UI_GUIDE M1).
// 원래 연결은 시안 경로 그대로, 바뀐 연결은 route()로 새 단자까지 이어 그린다. 시안 MobOverview의 route와 같은 규칙.
import { OVERVIEW as OV } from '../data';
import { create } from '../data/logic/wiring';
import type { WiringDoc } from '../store/store';

export type Cur = Record<string, string | null | undefined>;

export function route(ix: number, sx: number, sy: number, t: [number, number, number]): string {
  const k = ix % 4, [jx, jy, lane] = t, ln = lane - k * 3;
  const zs = sy < 84 ? 'top' : sy < 300 ? 'board' : sy < 388 ? 'mid' : 'low';
  const zt = lane < 100 ? 'top' : lane < 400 ? 'mid' : 'amp';
  if (sy < lane && ((zs === 'top' && zt === 'top') || (zs === 'mid' && zt === 'mid'))) return `M${sx} ${sy} V${ln} H${jx} V${jy}`;
  const cx = zt === 'amp' || (sx >= 206 && jx >= 206) ? 356 - k * 2.5 : 202 - k * 2.5;
  const ya = zs === 'top' ? 70 - k * 3 : zs === 'board' ? 46 - k * 3 : zs === 'mid' ? 368 + k * 3 : 382 - k * 3;
  return `M${sx} ${sy} V${ya} H${cx} V${ln} H${jx} V${jy}`;
}

/** 홈에 그릴 연결: 반영(ap)이 꺼져 있으면 원래 연결 */
export function shownCur(doc: WiringDoc | null): { cur: (id: string) => string | null; changed: number; ap: boolean } {
  const ap = !doc || doc.ap !== false;
  const raw: Cur = doc?.cur || {};
  const removed = new Set(doc?.removed || []);
  let changed = 0;
  for (const w of OV.wires) if (removed.has(w.id) || (raw[w.id] !== undefined && raw[w.id] !== w.orig)) changed++;
  const cur = (id: string) => {
    const w = OV.wires.find((x) => x.id === id);
    if (!w) return null;
    if (!ap) return w.orig;
    if (removed.has(id)) return null;
    const v = raw[id];
    return v === undefined ? w.orig : v;
  };
  return { cur, changed, ap };
}

export interface WireDraw { id: string; key: string; d: string; color: string; dash?: string; changed: boolean; jx: number; jy: number }
export function wiresFor(cur: (id: string) => string | null) {
  const wires: WireDraw[] = [];
  const cut: { key: string; x: number; y: number }[] = [];
  OV.wires.forEach((w, ix) => {
    const jid = cur(w.id);
    const t = jid ? OV.jacks[jid] : undefined;
    if (!t) { cut.push({ key: w.key, x: w.sx, y: w.sy + 6 }); return; }
    const ch = jid !== w.orig;
    wires.push({ id: w.id, key: w.key, d: ch ? route(ix, w.sx, w.sy, t) : w.d, color: w.color, dash: w.dash || undefined, changed: ch, jx: t[0], jy: t[1] });
  });
  return { wires, cut };
}

// ── 정보 상자의 신호 흐름: 바뀐 연결을 따라 다시 만든다 ──
const LOGIC = create();
const JACK: Record<string, { dev: string; name: string }> = Object.fromEntries(LOGIC.jacks.map((j: { id: string; dev: string; name: string }) => [j.id, j]));
const short = (dev: string) => dev.replace(/^(Mackie|Yamaha|MiCWL) /, '');
const FIRST: Record<string, string> = { Bs: 'c25', Gt: 'c26', Kb: 'c8', Dr: 'c10', Cd: 'c13', Pc: 'c15', Gl: 'c1', Gr: 'c2', M1: 'c23', M2: 'c24', M3: 'c22', Wl: 'c5' };
/** 중간 장비의 입력 단자 → 그 채널의 출력 케이블 */
const PASS: Record<string, [string, string]> = { dii1: ['c6', 'DI BOX CH1'], dii2: ['c7', 'DI BOX CH2'], wmi1: ['c3', '매립형 패널 1'], wmi2: ['c4', '매립형 패널 2'], wmi3: ['c22', '매립형 패널 3'] };
const MIXOUT: Record<string, [string, string]> = { 'Yamaha AG06': ['c11', 'AG06 STEREO OUT'], 'MiCWL L4': ['c17', 'L4 MAIN OUT'] };
const OK = '#f2f2f7', BAD = '#ffd9d6';

/** 소스의 흐름을 바뀐 연결대로. 연결이 원래와 같으면 null (시안 문구를 그대로 쓴다) */
export function chainFor(src: string, cur: (id: string) => string | null, title: string): { steps: [string, string][]; l1: string; cut: boolean } | null {
  let cid = FIRST[src];
  if (!cid) return null;
  const steps: [string, string][] = [[title, OK]];
  let changed = false, cut = false;
  for (let hop = 0; hop < 5 && cid; hop++) {
    const w = OV.wires.find((x) => x.id === cid);
    const j = cur(cid);
    if (w && j !== w.orig) changed = true;
    if (!j) { steps.push(['뽑혀 있음', BAD]); cut = true; break; }
    const jk = JACK[j];
    if (PASS[j]) { steps.push([PASS[j][1], OK]); cid = PASS[j][0]; continue; }
    steps.push([short(jk.dev) + ' ' + jk.name, OK]);
    const mo = MIXOUT[jk.dev];
    if (mo) { steps.push([mo[1], OK]); cid = mo[0]; continue; }
    break;
  }
  if (!changed) return null;
  const txt = steps.slice(1).map((s) => s[0]).join(' → ');
  return { steps, cut, l1: cut ? '케이블이 뽑혀 있어 소리가 믹서로 가지 않아요: ' + txt + '.' : '바뀐 연결: ' + txt + '.' };
}
