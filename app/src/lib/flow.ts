// 컨트롤을 고르면 입력 단자 → 노브·페이더 → 출력 단자를 점선과 원으로 잇는다 (시안 flowOf와 같은 계산).
import type { ControlDef, Flow, Profile } from '../data/types';

export interface FlowDraw { d: string; arrow: string; dots: { x: number; y: number; r: number }[]; text: string }

function dotOf(c: ControlDef) {
  if (c.type === 'knob') return { x: c.x, y: c.y, r: c.r + 9 };
  if (c.type === 'button') return { x: c.x + c.w / 2, y: c.y + c.h / 2, r: c.w / 2 + 3 };
  return { x: c.handle.x + c.handle.w / 2, y: c.ya + c.handle.h / 2, r: 16 };
}

export function flowFor(p: Profile, sel: string): FlowDraw | null {
  const f: Flow | undefined = p.flows.find((x) => x.ids.includes(sel));
  if (!f) return null;
  const dots = f.ids.map((id) => p.controls.find((c) => c.id === id)).filter(Boolean).map((c) => dotOf(c!));
  for (const j of (f.jacks || []).concat(f.outs || [])) dots.push({ x: j[0], y: j[1], r: j[2] });
  return {
    d: `M${f.x} ${f.y0} V${f.y1}`,
    arrow: `${f.x - 9},${f.y1 - 4} ${f.x + 9},${f.y1 - 4} ${f.x},${f.y1 + 10}`,
    dots,
    text: f.txt,
  };
}

/** 번호(flows 배열 순서)로 흐름 하나를 그린다. */
export function flowAt(p: Profile, i: number): FlowDraw | null {
  const f = p.flows[i];
  return f ? flowFor(p, f.ids[0]) : null;
}

/** 입력 단자(jack)를 누르면 그 채널의 흐름을 띄운다: 흐름 안의 첫 노브(보통 GAIN)를 고른다. */
export function pickForJack(p: Profile, i: number): string {
  const f = p.flows[i];
  return f.ids.find((id) => p.controls.find((c) => c.id === id)?.type === 'knob') ?? f.ids[0];
}

/** 간략 보기·전체 배선도: 소스를 누르면 그 소스가 들어가는 믹서 채널(들)의 흐름. 값은 profiles flows 배열 번호. */
export const SOURCE_FLOWS: Record<string, Partial<Record<'ag06' | 'dfx12' | 'l4', number[]>>> = {
  Bs: { ag06: [0], dfx12: [6] }, Gt: { ag06: [1], dfx12: [6] }, Kb: { ag06: [2], dfx12: [6] }, Dr: { ag06: [3], dfx12: [6] },
  Gl: { dfx12: [0] }, Gr: { dfx12: [1] }, M1: { dfx12: [2] }, M2: { dfx12: [3] }, M3: { dfx12: [4] }, Wl: { dfx12: [5] },
  Cd: { l4: [0, 1], dfx12: [9] }, Pc: { l4: [2], dfx12: [9] },
};
