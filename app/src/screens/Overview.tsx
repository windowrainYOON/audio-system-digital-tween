// M1 간략 보기: 실제 믹서 그림 3대 + 소스·앰프·스피커 + 겹치지 않는 케이블. 소스를 누르면 그 경로만 강조.
import { useState } from 'react';
import { DEV_BOARD, OVERVIEW as OV, PROFILES } from '../data';
import type { BoardId } from '../data/types';
import { PanelLayer } from '../components/Panel';
import { useStore } from '../store/store';

const BADGE = { warn: '#ff9500', info: '#0a84ff', error: '#ff3b30' } as const;
const DEVICE_KEYS = new Set(['Qsc', 'Mps']);

export function Overview({ onOpen }: { onOpen: (b: BoardId) => void }) {
  const boards = useStore((s) => s.boards);
  const [sel, setSel] = useState('Ag');
  const [src, setSrc] = useState('');
  const on = src ? OV.highlight[src] : null;
  const op = (k: string) => (!on || !k || k === 'Dfx' || on.includes(k) ? 1 : 0.2);

  const sv = src ? OV.sources[src] : null;
  const info = sv ? { ...sv, l3: OV.phones } : OV.devices[sel];
  const flow = sv ? sv.steps.concat(OV.post) : [];
  const target: BoardId = sv ? DEV_BOARD[sv.dev] : DEV_BOARD[sel];

  const pickBoard = (k: string) => { setSel(k); setSrc(''); };
  const key = (f: () => void) => (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f(); } };

  return (
    <div className="screen">
      <svg viewBox={`0 0 ${OV.width} ${OV.height}`} width="100%" role="group" aria-label="전체 장비 간략 보기"
        style={{ display: 'block', fontFamily: 'Noto Sans KR, sans-serif' }}>
        {OV.cables.map((c, i) => (
          <g key={i} opacity={op(c.key)}>
            <path d={c.d} fill="none" stroke="#fff" strokeWidth={4.6} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
            <path d={c.d} fill="none" stroke={c.color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={c.dash || undefined} />
          </g>
        ))}
        {OV.boards.map((b) => {
          const [cx, cy, cw, ch] = b.crop;
          const go = () => pickBoard(b.key);
          return (
            <g key={b.key} role="button" tabIndex={0} aria-label={PROFILES[b.board].title} style={{ cursor: 'pointer' }}
              onClick={go} onKeyDown={key(go)} opacity={op(b.key)}>
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
          const go = isSrc ? () => setSrc(x.key) : isDev ? () => pickBoard(x.key) : undefined;
          const ring = isSrc ? src === x.key : isDev ? !src && sel === x.key : false;
          const small = x.h < 30;
          return (
            <g key={i} opacity={op(isSrc ? x.key : '')} {...(go ? { role: 'button', tabIndex: 0, 'aria-label': x.title, onClick: go, onKeyDown: key(go), style: { cursor: 'pointer' } } : {})}>
              <rect x={x.x} y={x.y} width={x.w} height={x.h} rx={6} fill={x.fill} stroke={x.stroke} strokeWidth={1} />
              <text x={x.x + x.w / 2} y={x.y + (small ? 11 : 14)} fontSize={x.title.length > 7 ? 7.5 : 8.5} fontWeight={700} fill="#1d1d1f" textAnchor="middle">{x.title}</text>
              {x.sub && <text x={x.x + x.w / 2} y={x.y + (small ? 20 : 24)} fontSize={6.2} fill="#555" textAnchor="middle">{x.sub}</text>}
              {x.sub2 && <text x={x.x + x.w / 2} y={x.y + 32} fontSize={6.2} fill="#555" textAnchor="middle">{x.sub2}</text>}
              <rect x={x.x - 3} y={x.y - 3} width={x.w + 6} height={x.h + 6} rx={9} fill="none" stroke="#0066cc" strokeWidth={2.5} opacity={ring ? 1 : 0} />
            </g>
          );
        })}
        {OV.badges.map((b, i) => (
          <g key={i} aria-hidden="true">
            <circle cx={b.x} cy={b.y} r={7} fill={BADGE[b.level]} stroke="#fff" strokeWidth={1.5} />
            <text x={b.x} y={b.y + 3.2} fontSize={9} fontWeight={700} textAnchor="middle" fill={b.level === 'warn' ? '#1d1d1f' : '#fff'}>{b.t}</text>
          </g>
        ))}
        <g fontSize={7} fontWeight={700} fill="#1d1d1f">
          {OV.names.map((n) => <text key={n.t} x={n.x} y={n.y}>{n.t}</text>)}
        </g>
      </svg>

      <section className="card sheet" aria-label="선택한 장비">
        <div className="row">
          <div className="title">{info.title}</div>
          <span className="pill" style={{ background: info.bg }}>{info.badge}</span>
        </div>
        {flow.length > 0 && (
          <div className="flow" aria-label="신호 흐름">
            {flow.map((f, i) => (
              <span key={i} className="step">{i > 0 && <span className="arrow">→</span>}<span className="pill" style={{ background: f[1] }}>{f[0]}</span></span>
            ))}
          </div>
        )}
        <p>{info.l1}</p><p>{info.l2}</p><p>{info.l3}</p>
        <button className="primary" onClick={() => onOpen(target)}>{info.go}</button>
      </section>
    </div>
  );
}
