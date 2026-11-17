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
