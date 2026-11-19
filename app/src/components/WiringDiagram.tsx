// 믹서 3대 + 소스·중간 장비(DI BOX·매립형 패널)·앰프·스피커 + 케이블 (홈 M1).
// 케이블은 배선 데이터로 그린다(2026-11-18 사용자 결정): 배선이 바뀌면 상자를 꽂힌 단자 위로 다시 배열하고(ovLayout),
// 확인 안 한 변경은 노란 밑선, 뽑힌 케이블은 소스 아래 빨간 ✕. DI BOX·매립형 패널은 채널 칸(CH1·CH2 / CH1~3).
import { DEV_BOARD, OVERVIEW as OV, PROFILES } from '../data';
import { PanelLayer } from './Panel';
import { flowAt, SOURCE_FLOWS } from '../lib/flow';
import { useStore } from '../store/store';
import { layoutFor } from '../lib/ovwires';

const BADGE = { warn: '#ff9500', info: '#0a84ff', error: '#ff3b30' } as const;
const DEVICE_KEYS = new Set(['Qsc', 'Mps']);
const key = (f: () => void) => (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f(); } };

interface Props {
  /** 그릴 연결 (케이블 id → 단자 id, null = 뽑힘) */
  cur: (id: string) => string | null;
  /** 노란 선 기준(마지막으로 확인한 배선). 없으면 cur와 같음 = 노란 선 없음 */
  base?: (id: string) => string | null;
  /** 연결이 바뀐 소스는 믹서 안 흐름 표시(원래 연결 기준)를 끈다 */
  noFlow?: boolean;
  src?: string; sel?: string; labels?: boolean;
  onSource?: (k: string) => void; onDevice?: (k: string) => void;
}

/** 좌표계: 0 OV.top 358 OV.height. 바깥 <svg>로 감싸서 쓴다. */
export function WiringDiagram({ cur, base, noFlow, src = '', sel = '', labels = false, onSource, onDevice }: Props) {
  const boards = useStore((s) => s.boards);
  const on = src ? OV.highlight[src] : null;
  const { wires, cut, boxes: pos } = layoutFor(cur, base || cur);
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
              <PanelLayer profile={PROFILES[b.board]} state={boards[b.board]} flowWidth={2.4} noStubs
                flows={(noFlow ? [] : SOURCE_FLOWS[src]?.[b.board] || []).map((i) => flowAt(PROFILES[b.board], i)!).filter(Boolean)} />
            </svg>
            <rect x={b.x - 3} y={b.y - 3} width={cw * b.scale + 6} height={ch * b.scale + 6} rx={8} fill="none"
              stroke="#0066cc" strokeWidth={2.5} opacity={!src && sel === b.key ? 1 : 0} />
          </g>
        );
      })}
      {wires.map((c) => (
        <g key={c.id} opacity={op(c.key)} pointerEvents="none" data-wire={c.id} data-changed={c.ch ? '1' : undefined}>
          <path d={c.d} fill="none" stroke={c.ch ? '#FFD60A' : '#fff'} strokeWidth={c.ch ? 6.4 : 4.6} strokeLinecap="round" strokeLinejoin="round" opacity={0.95} />
          <path d={c.d} fill="none" stroke={c.color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={c.dash || undefined} />
          <circle cx={c.jx} cy={c.jy} r={2.6} fill={c.color} stroke="#fff" strokeWidth={1} />
        </g>
      ))}
      {OV.boxes.map((x, i) => {
        const isSrc = !!x.src;
        const isDev = DEVICE_KEYS.has(x.key);
        const go = isSrc && onSource ? () => onSource(x.key) : isDev && onDevice ? () => onDevice(x.key) : undefined;
        const ring = isSrc ? src === x.key : isDev ? !src && sel === x.key : false;
        const small = x.h < 30;
        const two = !!x.sub && small;
        const dx = pos[x.key]?.dx || 0;
        if (x.chs && isSrc) {
          // 스테레오 출력 단자가 L·R 따로인 소스(드럼, CD): 제목·부제 아래 L·R 칸 (시안 MobOverview)
          const cx = x.x + x.w / 2;
          const big = x.h >= 36;
          return (
            <g key={i} transform={dx ? `translate(${dx},0)` : undefined} opacity={op(x.key)} {...btn(x.title + ' (출력 L·R)', go)}>
              <rect x={x.x} y={x.y} width={x.w} height={x.h} rx={6} fill={x.fill} stroke={x.stroke} strokeWidth={1} />
              <text x={cx} y={x.y + (big ? 11.5 : 8.5)} fontSize={big ? 7.8 : 7.4} fontWeight={700} fill="#1d1d1f" textAnchor="middle">{x.title}</text>
              {x.sub && <text x={cx} y={x.y + (big ? 19.5 : 15)} fontSize={big ? 6.2 : 5.2} fill="#555" textAnchor="middle">{x.sub}</text>}
              <path d={`M${cx} ${x.y + (big ? 24 : 18)} V${x.y + x.h - 2}`} stroke={x.stroke} strokeWidth={0.8} opacity={big ? 1 : 0.6} />
              {x.chs.map((c) => <text key={c[0]} x={cx + c[1]} y={x.y + x.h - (big ? 5.5 : 4.5)} fontSize={6.6} fontWeight={700} fill="#1d1d1f" textAnchor="middle">{c[0]}</text>)}
              <rect x={x.x - 3} y={x.y - 3} width={x.w + 6} height={x.h + 6} rx={9} fill="none" stroke="#0066cc" strokeWidth={2.5} opacity={ring ? 1 : 0} />
            </g>
          );
        }
        if (x.chs) {
          const cx = x.x + x.w / 2;
          return (
            <g key={i} transform={`translate(${dx},0)`} opacity={op(x.key)} role="img" aria-label={x.title + ' ' + x.chs.map((c) => c[0]).join('·')}>
              <rect x={x.x} y={x.y} width={x.w} height={x.h} rx={6} fill={x.fill} stroke={x.stroke} strokeWidth={1} />
              <text x={cx} y={x.y + 6.8} fontSize={5.6} fontWeight={700} fill="#1d1d1f" textAnchor="middle">{x.title}</text>
              {x.chs.slice(1).map((c, k) => { const m = cx + (x.chs![k][1] + c[1]) / 2; return <path key={k} d={`M${m} ${x.y + 9} V${x.y + x.h - 2}`} stroke="#9aa0a6" strokeWidth={0.8} />; })}
              {x.chs.map((c) => <text key={c[0]} x={cx + c[1]} y={x.y + x.h - 4.5} fontSize={6.6} fontWeight={700} fill="#1d1d1f" textAnchor="middle">{c[0]}</text>)}
            </g>
          );
        }
        return (
          <g key={i} transform={dx ? `translate(${dx},0)` : undefined} opacity={op(isSrc || x.key === 'Di' || x.key === 'Wp' ? x.key : '')} {...btn(x.title, go)}>
            <rect x={x.x} y={x.y} width={x.w} height={x.h} rx={6} fill={x.fill} stroke={x.stroke} strokeWidth={1} />
            <text x={x.x + x.w / 2} y={x.y + (two ? x.h / 2 - 1 : small ? x.h / 2 + 3 : 14)} fontSize={small ? (x.title.length > 5 ? 6.6 : 7.8) : x.title.length > 7 ? 7.5 : 8.5} fontWeight={700} fill="#1d1d1f" textAnchor="middle">{x.title}</text>
            {x.sub && <text x={x.x + x.w / 2} y={x.y + (two ? x.h / 2 + 7 : 24)} fontSize={x.sub.length > 10 ? 5.4 : 6.2} fill="#555" textAnchor="middle">{x.sub}</text>}
            {x.sub2 && <text x={x.x + x.w / 2} y={x.y + 32} fontSize={6.2} fill="#555" textAnchor="middle">{x.sub2}</text>}
            <rect x={x.x - 3} y={x.y - 3} width={x.w + 6} height={x.h + 6} rx={9} fill="none" stroke="#0066cc" strokeWidth={2.5} opacity={ring ? 1 : 0} />
          </g>
        );
      })}
      {cut.map((t, i) => (
        <g key={'cut' + i} opacity={op(t.key)} aria-label="뽑힌 케이블">
          <circle cx={t.x} cy={t.y} r={5} fill="#ff3b30" stroke="#fff" strokeWidth={1.2} />
          <path d={`M${t.x - 2} ${t.y - 2} L${t.x + 2} ${t.y + 2} M${t.x + 2} ${t.y - 2} L${t.x - 2} ${t.y + 2}`} stroke="#fff" strokeWidth={1.6} strokeLinecap="round" />
        </g>
      ))}
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
