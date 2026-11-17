// M7 전체 배선도: 간략 보기와 같은 그림·같은 케이블을 2배로 키우고 케이블 이름을 붙인다.
// 두 손가락으로 확대·축소, 한 손가락으로 끌어서 이동, 휠·버튼도 지원.
import { useRef, useState } from 'react';
import { WiringDiagram } from '../components/WiringDiagram';
import { TopHeader } from '../components/TopHeader';

const W = 800, H = 2170;
type Pt = { x: number; y: number };
interface View { k: number; x: number; y: number }

export function FullWiring() {
  const root = useRef<HTMLDivElement>(null);
  const [v, setV] = useState<View>({ k: 1, x: 0, y: 0 });
  const [src, setSrc] = useState('');
  const ptrs = useRef(new Map<number, Pt>());
  const base = useRef<{ d?: number; k: number; mx: number; my: number; x: number; y: number } | null>(null);
  const moved = useRef(false);

  const loc = (e: { clientX: number; clientY: number }): Pt => {
    const r = root.current!.getBoundingClientRect();
    const f = W / (r.width || W);
    return { x: (e.clientX - r.left) * f, y: (e.clientY - r.top) * f };
  };
  const zoomAt = (cur: View, nk: number, cx: number, cy: number): View => {
    nk = Math.max(0.4, Math.min(8, nk));
    const px = (cx - cur.x) / cur.k, py = (cy - cur.y) / cur.k;
    return { k: nk, x: cx - nk * px, y: cy - nk * py };
  };
  const start = () => {
    const p = [...ptrs.current.values()];
    if (p.length >= 2) {
      base.current = { d: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) || 1, k: v.k, mx: (p[0].x + p[1].x) / 2, my: (p[0].y + p[1].y) / 2, x: v.x, y: v.y };
    } else if (p.length === 1) base.current = { k: v.k, mx: p[0].x, my: p[0].y, x: v.x, y: v.y };
    else base.current = null;
  };
  const down = (e: React.PointerEvent) => {
    ptrs.current.set(e.pointerId, loc(e));
    moved.current = false;
    start();
  };
  const move = (e: React.PointerEvent) => {
    if (!ptrs.current.has(e.pointerId) || !base.current) return;
    ptrs.current.set(e.pointerId, loc(e));
    const p = [...ptrs.current.values()];
    const b = base.current;
    if (p.length >= 2 && b.d) {
      const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      const mx = (p[0].x + p[1].x) / 2, my = (p[0].y + p[1].y) / 2;
      const z = zoomAt({ k: b.k, x: b.x, y: b.y }, (b.k * d) / b.d, b.mx, b.my);
      setV({ ...z, x: z.x + mx - b.mx, y: z.y + my - b.my });
      moved.current = true;
    } else if (p.length === 1) {
      const dx = p[0].x - b.mx, dy = p[0].y - b.my;
      if (Math.abs(dx) + Math.abs(dy) > 6) { moved.current = true; try { root.current?.setPointerCapture(e.pointerId); } catch { /* 무시 */ } }
      if (moved.current) setV({ k: b.k, x: b.x + dx, y: b.y + dy });
    }
  };
  const up = (e: React.PointerEvent) => { ptrs.current.delete(e.pointerId); start(); };
  const wheel = (e: React.WheelEvent) => { const p = loc(e); setV((c) => zoomAt(c, c.k * Math.exp(-e.deltaY / 300), p.x, p.y)); };
  const btn = (f: number) => setV((c) => zoomAt(c, c.k * f, W / 2, 400));
  // 끌어서 이동한 뒤의 탭은 소스 선택으로 치지 않는다
  const pick = (k: string) => { if (!moved.current) setSrc(src === k ? '' : k); };

  return (
    <>
      <TopHeader full />
      <div ref={root} className="zoomroot" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onWheel={wheel}>
        <div className="zoombar" onPointerDown={(e) => e.stopPropagation()}>
          <span className="hint">두 손가락으로 확대·축소 · 끌어서 이동</span>
          <button className="zbtn" aria-label="축소" onClick={() => btn(1 / 1.4)}>−</button>
          <button className="zbtn" aria-label="확대" onClick={() => btn(1.4)}>+</button>
          <button className="zbtn reset" aria-label="처음 크기" onClick={() => setV({ k: 1, x: 0, y: 0 })}>전체</button>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="group" aria-label="전체 배선도" style={{ display: 'block', fontFamily: 'Noto Sans KR, sans-serif' }}>
          <g transform={`translate(${v.x},${v.y}) scale(${v.k})`}>
            <text x="40" y="48" fontSize="24" fontWeight="700" fill="#1d1d1f">중명교회 음향 장비 전체 배선도</text>
            <text x="40" y="74" fontSize="12" fill="#555">실제 믹서 그림 위에 케이블이 꽂히는 단자를 그대로 연결했어요. 소스를 누르면 그 경로만 보여요.</text>
            <g transform="translate(40,100) scale(2)"><WiringDiagram labels src={src} onSource={pick} /></g>
            <g transform="translate(0,110)" fontSize="11" fill="#333">
              <rect x="40" y="1890" width="720" height="150" rx="10" fill="#fff" stroke="#d1d1d6" />
              <text x="56" y="1914" fontWeight="700" fontSize="13">범례·메모</text>
              <path d="M56 1932 H96" stroke="#444" strokeWidth="3.5" /><text x="104" y="1936">XLR</text>
              <path d="M160 1932 H200" stroke="#6B7280" strokeWidth="3.5" /><text x="208" y="1936">TS/RCA</text>
              <path d="M290 1932 H330" stroke="#B45309" strokeWidth="3.5" strokeDasharray="8 6" /><text x="338" y="1936">AG06 → DFX 9/10</text>
              <path d="M470 1932 H510" stroke="#0F766E" strokeWidth="3.5" /><text x="518" y="1936">드럼 TS→RCA</text>
              <text x="56" y="1964">· 키보드는 TRS로 나와서 TS 2줄로 AG06 3/4에 꽂아요.</text>
              <text x="56" y="1984">· 드럼은 TS 모노 2줄을 RCA로 바꿔 AG06 5/6에 꽂아요.</text>
              <text x="56" y="2004">· 베이스·기타는 각각 DI BOX를 거쳐 AG06 CH1·CH2에 연결돼요.</text>
              <text x="56" y="2024">· 주황 ! / 빨강 × 배지는 점검이 필요한 지점이에요.</text>
            </g>
          </g>
        </svg>
      </div>
    </>
  );
}
