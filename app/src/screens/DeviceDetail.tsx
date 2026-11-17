// M2~M4 상세 (시안 MobL4·MobDfx·MobAg06): ‹ 간략 + 장비 알약 3개, 전원 + 구역 칩, 스크롤 패널, 둥근 인스펙터.
import { useRef, useState } from 'react';
import { PROFILES } from '../data';
import type { BoardId } from '../data/types';
import { Panel } from '../components/Panel';
import { Inspector, InspectorHandle } from '../components/Inspector';
import { flowFor, pickForJack } from '../lib/flow';
import { inspect } from '../lib/inspect';
import { go } from '../nav';
import { markSynced, setPower, setValue, useStore } from '../store/store';

const ORDER: [BoardId, string][] = [['l4', 'L4'], ['dfx12', 'DFX-12'], ['ag06', 'AG06']];

export function DeviceDetail({ board }: { board: BoardId }) {
  const p = PROFILES[board];
  const st = useStore((s) => s.boards[board]);
  const [selBy, setSelBy] = useState<Partial<Record<BoardId, string>>>({});
  const pan = useRef<HTMLElement>(null);
  // 평소에는 숨겨 두고(우측 하단 버튼), 컨트롤을 누르면 뜬다
  const [open, setOpen] = useState(false);
  const d = p.controls.find((c) => c.id === selBy[board]) ?? p.controls[0];
  const v = st.vals[d.id] ?? d.def;
  const info = inspect(board, d.id, st);
  const power = st.power !== false;
  const [vx, vy, vw] = p.viewBox;
  const k = p.size[0] / vw;
  const jump = (x: number, y: number) => pan.current?.scrollTo({ left: Math.max(0, (x - vx) * k - 12), top: Math.max(0, (y - vy) * k - 12), behavior: 'smooth' });

  return (
    <>
      <header className="hdr">
        <div className="toprow">
          <button className="back" onClick={() => go('home')}>
            <svg width="12" height="18" viewBox="0 0 12 18" fill="none" stroke="#0066cc" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 2L3 9l6 7" /></svg>간략
          </button>
          {ORDER.map(([b, l]) => (
            <button key={b} className="pill-btn" aria-current={b === board ? 'true' : undefined} onClick={() => go('panel', b)}>{l}</button>
          ))}
        </div>
        <div className="chips">
          <button className="power" style={{ background: power ? '#2DD4BF' : '#5E6166', color: power ? '#0B1F1D' : '#fff' }}
            aria-pressed={power} onClick={() => setPower(board, !power)}>{power ? '전원 ON' : '전원 OFF'}</button>
          {p.chips.map(([l, x, y]) => <button key={l} className="chip" onClick={() => jump(x, y)}>{l}</button>)}
        </div>
      </header>
      <main ref={pan} className="pan" aria-label={p.title + ' 믹서 패널'}>
        <Panel profile={p} state={st} selected={d.id} flow={flowFor(p, d.id)} label={p.title + ' 믹서 패널 그림'} width={p.size[0]}
          onPick={(id) => { setSelBy({ ...selBy, [board]: id }); setOpen(true); }}
          onJack={(i) => setSelBy({ ...selBy, [board]: pickForJack(p, i) })} />
        <div style={{ height: open ? 520 : 88 }} aria-hidden="true" />
      </main>
      {open ? (
        <Inspector key={board + d.id} d={d} v={v} info={info} unsynced={st.synced[d.id] === false} onHide={() => setOpen(false)}
          onChange={(nv) => setValue(board, d.id, nv)} onSynced={() => markSynced(board, d.id)} />
      ) : (
        <InspectorHandle name={info.name} unsynced={st.synced[d.id] === false} onOpen={() => setOpen(true)} />
      )}
    </>
  );
}
