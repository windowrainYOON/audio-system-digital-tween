// 믹서 3대 + 소스·앰프·스피커 + 케이블. 간략 보기(M1)와 전체 배선도(M7)가 같은 그림·같은 배치를 쓴다.
import { DEV_BOARD, OVERVIEW as OV, PROFILES } from '../data';
import { PanelLayer } from './Panel';
import { useStore } from '../store/store';

const BADGE = { warn: '#ff9500', info: '#0a84ff', error: '#ff3b30' } as const;
const DEVICE_KEYS = new Set(['Qsc', 'Mps']);
const key = (f: () => void) => (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f(); } };

interface Props {
  src?: string; sel?: string; labels?: boolean;
  onSource?: (k: string) => void; onDevice?: (k: string) => void;
}

/** 좌표계: 0 0 358 940 (OV.width × OV.height). 바깥 <svg>나 <g transform>으로 감싸서 쓴다. */
export function WiringDiagram({ src = '', sel = '', labels = false, onSource, onDevice }: Props) {
  const boards = useStore((s) => s.boards);
  const on = src ? OV.highlight[src] : null;
  const op = (k: string) => (!on || !k || k === 'Dfx' || on.includes(k) ? 1 : 0.2);
  const btn = (label: string, f?: () => void) =>
    f ? { role: 'button', tabIndex: 0, 'aria-label': label, onClick: f, onKeyDown: key(f), style: { cursor: 'pointer' } } : {};

  return (
    <g>
      {OV.cables.map((c, i) => (
        <g key={i} opacity={op(c.key)}>
          <path d={c.d} fill="none" stroke="#fff" strokeWidth={4.6} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
          <path d={c.d} fill="none" stroke={c.color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={c.dash || undefined} />
        </g>
      ))}
      {OV.boards.map((b) => {
        const [cx, cy, cw, ch] = b.crop;
        return (
          <g key={b.key} opacity={op(b.key)} {...btn(PROFILES[b.board].title, onDevice && (() => onDevice(b.key)))}>
            <svg x={b.x} y={b.y} width={cw * b.scale} height={ch * b.scale} viewBox={`${cx} ${cy} ${cw} ${ch}`} overflow="hidden">
              <PanelLayer profile={PROFILES[b.board]} state={boards[b.board]} />
            </svg>
            <rect x={b.x - 3} y={b.y - 3} width={cw * b.scale + 6} height={ch * b.scale + 6} rx={8} fill="none"
              stroke="#0066cc" strokeWidth={2.5} opacity={!src && sel === b.key ? 1 : 0} />
          </g>
        );
      })}
      {OV.boxes.map((x, i) => {
        const isSrc = !!OV.highlight[x.key];
        const isDev = DEVICE_KEYS.has(x.key);
        const go = isSrc && onSource ? () => onSource(x.key) : isDev && onDevice ? () => onDevice(x.key) : undefined;
        const ring = isSrc ? src === x.key : isDev ? !src && sel === x.key : false;
        const small = x.h < 30;
        return (
          <g key={i} opacity={op(isSrc ? x.key : '')} {...btn(x.title, go)}>
            <rect x={x.x} y={x.y} width={x.w} height={x.h} rx={6} fill={x.fill} stroke={x.stroke} strokeWidth={1} />
            <text x={x.x + x.w / 2} y={x.y + (small ? 11 : 14)} fontSize={x.title.length > 7 ? 7.5 : 8.5} fontWeight={700} fill="#1d1d1f" textAnchor="middle">{x.title}</text>
            {x.sub && <text x={x.x + x.w / 2} y={x.y + (small ? 20 : 24)} fontSize={6.2} fill="#555" textAnchor="middle">{x.sub}</text>}
            {x.sub2 && <text x={x.x + x.w / 2} y={x.y + 32} fontSize={6.2} fill="#555" textAnchor="middle">{x.sub2}</text>}
            <rect x={x.x - 3} y={x.y - 3} width={x.w + 6} height={x.h + 6} rx={9} fill="none" stroke="#0066cc" strokeWidth={2.5} opacity={ring ? 1 : 0} />
          </g>
        );
      })}
      {labels && OV.cables.filter((c) => c.label && c.lx !== undefined).map((c, i) => (
        <text key={i} x={c.lx} y={c.ly} fontSize={5.2} fill="#333" stroke="#fff" strokeWidth={2} paintOrder="stroke" opacity={op(c.key)}>{c.label}</text>
      ))}
      {OV.badges.map((b, i) => (
        <g key={i} aria-hidden="true">
          <circle cx={b.x} cy={b.y} r={7} fill={BADGE[b.level]} stroke="#fff" strokeWidth={1.5} />
          <text x={b.x} y={b.y + 3.2} fontSize={9} fontWeight={700} textAnchor="middle" fill={b.level === 'warn' ? '#1d1d1f' : '#fff'}>{b.t}</text>
        </g>
      ))}
      <g fontSize={7} fontWeight={700} fill="#1d1d1f">
        {OV.names.map((n) => <text key={n.t} x={n.x} y={n.y}>{n.t}</text>)}
      </g>
    </g>
  );
}
export { DEV_BOARD };
