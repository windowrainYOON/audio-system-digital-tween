// 홈 배선도의 케이블을 배선 데이터(wiring.cur)로 그린다 (2026-11-18 사용자 결정, UI_GUIDE M1).
// 경로·상자 위치는 시안과 같은 ovLayout(data/logic/ovlayout.js, 원본 tools/ovlayout.js)으로 계산한다.
import { OVERVIEW as OV } from '../data';
import { create } from '../data/logic/wiring';
import { ovLayout } from '../data/logic/ovlayout';
import type { WiringDoc } from '../store/store';

export type Cur = Record<string, string | null | undefined>;

/** 홈에 그릴 연결과 노란 선 기준.
 * cur: 반영(ap)이 꺼져 있으면 원래 연결. base: 마지막으로 확인한 배선(ackCur, 없으면 원래 연결).
 * 지금 변경 묶음을 이미 확인했다면(ack === sig) 노란 선 없음. */
export function shownCur(doc: WiringDoc | null): { cur: (id: string) => string | null; base: (id: string) => string | null; changed: number; ap: boolean } {
  const ap = !doc || doc.ap !== false;
  const raw: Cur = doc?.cur || {};
  const removed = new Set(doc?.removed || []);
  let changed = 0;
  for (const w of OV.wires) if (removed.has(w.id) || (raw[w.id] !== undefined && raw[w.id] !== w.orig)) changed++;
  const orig = (id: string) => OV.wires.find((x) => x.id === id)?.orig ?? null;
  const cur = (id: string) => {
    const o = orig(id);
    if (o === null) return null;
    if (!ap) return o;
    if (removed.has(id)) return null;
    const v = raw[id];
    return v === undefined ? o : v;
  };
  const acked = !!doc && !!doc.ack && doc.ack === sigOf(doc);
  const ac = doc?.ackCur || null;
  const base = (id: string) => (!ap ? orig(id) : acked ? cur(id) : ac && ac[id] !== undefined ? ac[id] : orig(id));
  return { cur, base, changed, ap };
}

/** 홈 배치(2026-11-18): 상자를 꽂힌 단자 위로 다시 놓고 선마다 통로 높이를 달리한다. 시안과 같은 tools/ovlayout.js */
export function layoutFor(cur: (id: string) => string | null, base: (id: string) => string | null) {
  return ovLayout(cur, base);
}

// ── 확인 기준: 배선 탭 시안의 changeSig + 추가·삭제 (lib/wiring.ts x.sig와 같은 규칙) ──
type Cable = { id: string; from: string; orig: string };
function cablesOf(doc: WiringDoc): Cable[] {
  const rm = new Set(doc.removed || []);
  return (LOGIC.cables as Cable[]).filter((c) => !rm.has(c.id)).concat((doc.added || []) as Cable[]);
}
function normCur(doc: WiringDoc): Cur {
  const cur: Cur = {};
  for (const k of cablesOf(doc)) { const j = doc.cur[k.id]; cur[k.id] = j === null ? null : j && JACK[j] ? j : k.orig; }
  return cur;
}
export function sigOf(doc: WiringDoc): string {
  const cur = normCur(doc);
  return LOGIC.changeSig.call({ cables: cablesOf(doc) }, cur) + '|' + (doc.added || []).map((a) => a.id).join(',') + '|' + (doc.removed || []).join(',');
}
export interface Change { id: string; name: string; from: string; to: string }
const jname = (j: string | null | undefined) => (j && JACK[j] ? JACK[j].dev + ' ' + JACK[j].name : '연결 안 됨');
/** 점검 탭 '배선 변경' 목록: 확인 기준과 다른 케이블. 이미 확인한 묶음이면 빈 목록 */
export function changesOf(doc: WiringDoc | null): Change[] {
  if (!doc || (doc.ack && doc.ack === sigOf(doc))) return [];
  const cur = normCur(doc);
  const ac = doc.ackCur || null;
  const out: Change[] = [];
  for (const k of cablesOf(doc)) {
    const b = ac && ac[k.id] !== undefined ? ac[k.id] : k.orig;
    if (cur[k.id] !== b) out.push({ id: k.id, name: k.from, from: jname(b), to: jname(cur[k.id]) });
  }
  for (const id of doc.removed || []) {
    const k = (LOGIC.cables as Cable[]).find((c) => c.id === id);
    if (k && !(ac && ac[id] === null)) out.push({ id, name: k.from, from: jname(ac && ac[id] !== undefined ? ac[id] : k.orig), to: '케이블 삭제' });
  }
  return out;
}

// ── 정보 상자의 신호 흐름: 바뀐 연결을 따라 다시 만든다 ──
const LOGIC = create();
const JACK: Record<string, { dev: string; name: string }> = Object.fromEntries(LOGIC.jacks.map((j: { id: string; dev: string; name: string }) => [j.id, j]));
const short = (dev: string) => dev.replace(/^(Mackie|Yamaha|MiCWL) /, '');
const FIRST: Record<string, string> = { Bs: 'c25', Gt: 'c26', Kb: 'c8', Dr: 'c10', Cd: 'c13', Pc: 'c15', Gl: 'c1', Gr: 'c2', M1: 'c23', M2: 'c24', M3: 'c22', Wl: 'c5' };
/** 중간 장비의 입력 단자 → 그 채널의 출력 케이블 */
const PASS: Record<string, [string, string]> = { dii1: ['c6', 'DI BOX CH1'], dii2: ['c7', 'DI BOX CH2'], wmi1: ['c3', '매립형 패널 CH1'], wmi2: ['c4', '매립형 패널 CH2'], wmi3: ['c22', '매립형 패널 CH3'] };
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
