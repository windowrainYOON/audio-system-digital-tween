// M2~M4 상세: 실물 패널에서 컨트롤을 누르면 신호 흐름 점선이 뜨고, 아래 인스펙터에서 값을 바꾼다.
import { useState } from 'react';
import { BOARD_IDS, PROFILES } from '../data';
import type { BoardId } from '../data/types';
import { Panel } from '../components/Panel';
import { Inspector } from '../components/Inspector';
import { flowFor } from '../lib/flow';
import { markSynced, setPhantom, setValue, useStore } from '../store/store';

export function DeviceDetail({ board, onBoard }: { board: BoardId; onBoard: (b: BoardId) => void }) {
  const p = PROFILES[board];
  const st = useStore((s) => s.boards[board]);
  const [selBy, setSelBy] = useState<Partial<Record<BoardId, string>>>({});
  const d = p.controls.find((c) => c.id === selBy[board]) ?? p.controls[0];
  const v = st.vals[d.id] ?? d.def;
  const flow = flowFor(p, d.id);

  return (
    <div className="screen">
      <div className="seg" role="tablist" aria-label="믹서 고르기">
        {BOARD_IDS.map((b) => (
          <button key={b} role="tab" aria-selected={b === board} className={b === board ? 'on' : ''} onClick={() => onBoard(b)}>{PROFILES[b].title.split(' ').pop()}</button>
        ))}
      </div>
      <div className="panelbox">
        <Panel profile={p} state={st} selected={d.id} flow={flow} label={p.title + ' 패널 그림'}
          onPick={(id) => setSelBy({ ...selBy, [board]: id })} />
      </div>
      {board === 'l4' && (
        <button className="toggle wide" aria-pressed={!!st.phantom} onClick={() => setPhantom(board, !st.phantom)}>
          {st.phantom ? 'PHANTOM +48V 켜짐 (눌러서 끄기)' : 'PHANTOM +48V 꺼짐 (눌러서 켜기)'}
        </button>
      )}
      <Inspector key={board + d.id} d={d} v={v} unsynced={st.synced[d.id] === false} flowText={flow?.text}
        onChange={(nv) => setValue(board, d.id, nv)} onSynced={() => markSynced(board, d.id)} />
    </div>
  );
}
