// 노브·페이더·버튼. 좌표와 모양은 장비 프로필(JSON)에서, 값 → 각도·높이·ON/OFF는 lib/convert.
import type { ButtonDef, FaderDef, KnobDef } from '../data/types';
import { faderY, isOn, knobAngle } from '../lib/convert';

const SEL = '#2DD4BF';
const AMBER = '#F59E0B';

interface P<D> { d: D; v: number; sel?: boolean; unsynced?: boolean; onPick?: (id: string) => void }

const a11y = (name: string, onPick?: () => void) =>
  onPick
    ? { role: 'button', tabIndex: 0, 'aria-label': name, style: { cursor: 'pointer' }, onClick: onPick,
        onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(); } } }
    : { 'aria-label': name };

export function Knob({ d, v, sel, unsynced, onPick }: P<KnobDef>) {
  return (
    <g data-cid={d.id} {...a11y(d.name, onPick && (() => onPick(d.id)))}>
      <circle cx={d.x} cy={d.y} r={d.rr} fill="transparent" stroke={sel ? SEL : 'transparent'} strokeWidth={3} />
      <circle cx={d.x} cy={d.y} r={d.r} fill={d.cap} stroke={d.stroke} strokeWidth={1.5} />
      <line x1={0} y1={d.l1} x2={0} y2={d.l2} stroke={d.ptr} strokeWidth={3} strokeLinecap="round"
        transform={`translate(${d.x},${d.y}) rotate(${knobAngle(v)})`} />
      {unsynced && <circle cx={d.x + d.r * 0.8} cy={d.y - d.r * 0.8} r={5} fill={AMBER} stroke="#1B1F23" strokeWidth={1} />}
    </g>
  );
}

export function Fader({ d, v, sel, unsynced, onPick }: P<FaderDef>) {
  const y = faderY(d.ya, d.yb, v);
  const h = d.handle;
  return (
    <g data-cid={d.id} {...a11y(d.name, onPick && (() => onPick(d.id)))}>
      <rect x={d.track.x} y={d.track.y} width={d.track.w} height={d.track.h} fill="#111" />
      <rect x={h.x} y={y} width={h.w} height={h.h} rx={h.rx} fill={h.fill} stroke={sel ? SEL : d.ring} strokeWidth={h.sw} />
      {unsynced && <circle cx={h.x + h.w} cy={y} r={5} fill={AMBER} stroke="#1B1F23" strokeWidth={1} />}
    </g>
  );
}

export function Button({ d, v, sel, unsynced, onPick }: P<ButtonDef>) {
  const on = isOn(v);
  const red = d.on === '#E0332B';
  return (
    <g data-cid={d.id} {...a11y(d.name + (on ? ' 켜짐' : ' 꺼짐'), onPick && (() => onPick(d.id)))}>
      <rect x={d.x} y={d.y} width={d.w} height={d.h} rx={d.rx + 1} fill="none" stroke={d.on} strokeWidth={2} opacity={on ? 1 : 0} />
      <rect x={d.x} y={d.y} width={d.w} height={d.h} rx={d.rx} fill={on ? d.on : '#5E6166'}
        stroke={sel ? SEL : on ? '#1B1F23' : '#3A3C40'} strokeWidth={3} />
      <text x={d.cx} y={d.ty} fontSize={d.fs} fontWeight={700} textAnchor="middle" pointerEvents="none"
        fill={on ? (red ? '#FFFFFF' : '#05302A') : '#D0D2D6'}>{on ? 'ON' : 'OFF'}</text>
      {unsynced && <circle cx={d.x + d.w} cy={d.y} r={5} fill={AMBER} stroke="#1B1F23" strokeWidth={1} />}
    </g>
  );
}
