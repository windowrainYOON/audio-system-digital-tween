// M2~M4 상세 (M0 최소판): 실물 패널을 누르면 아래 인스펙터에서 값 조절, "실물에 맞췄어요"로 일치 표시.
import { useState } from 'react';
import { BOARD_IDS, PROFILES } from '../data';
import type { BoardId } from '../data/types';
import { Panel } from '../components/Panel';
import { readout } from '../lib/convert';
import { markSynced, setPhantom, setValue, useStore } from '../store/store';

export function DeviceDetail({ board, onBoard }: { board: BoardId; onBoard: (b: BoardId) => void }) {
  const p = PROFILES[board];
  const st = useStore((s) => s.boards[board]);
  const [sel, setSel] = useState<string>(p.controls[0].id);
  const d = p.controls.find((c) => c.id === sel) ?? p.controls[0];
  const v = st.vals[d.id] ?? d.def;
  const r = readout(d, v);
  const flow = p.flows.find((f) => f.ids.includes(d.id));
  const unsynced = st.synced[d.id] === false;

  return (
    <div className="screen">
      <div className="seg" role="tablist" aria-label="믹서 고르기">
        {BOARD_IDS.map((b) => (
          <button key={b} role="tab" aria-selected={b === board} className={b === board ? 'on' : ''} onClick={() => onBoard(b)}>{PROFILES[b].title.split(' ').pop()}</button>
        ))}
      </div>
      <div className="panelbox"><Panel profile={p} state={st} selected={d.id} onPick={setSel} label={p.title + ' 패널 그림'} /></div>

      <section className="card sheet" aria-label="인스펙터">
        <div className="row">
          <div className="title">{d.name}</div>
          <span className="pill" style={{ background: unsynced ? '#fff3d6' : '#dff5e3' }}>{unsynced ? '실물 확인 필요' : '실물과 일치'}</span>
        </div>
        <div className="readout">
          {d.type === 'knob' && <span><b>{r.hour}</b> 방향</span>}
          {d.type !== 'button' && <span>눈금 <b>{r.scale}</b></span>}
          <span><b>{r.db}</b></span>
        </div>
        {d.type === 'button' ? (
          <button className="toggle" aria-pressed={v === 1} onClick={() => setValue(board, d.id, v === 1 ? 0 : 1)}>{v === 1 ? '켜짐 · 눌러서 끄기' : '꺼짐 · 눌러서 켜기'}</button>
        ) : (
          <label className="slider">
            <span className="sr">{d.name} 값</span>
            <input type="range" min={0} max={1} step={0.01} value={v} onChange={(e) => setValue(board, d.id, Number(e.target.value))} />
          </label>
        )}
        {board === 'l4' && (
          <button className="toggle" aria-pressed={!!st.phantom} onClick={() => setPhantom(board, !st.phantom)}>{st.phantom ? '+48V ON (눌러서 끄기)' : '+48V OFF (눌러서 켜기)'}</button>
        )}
        {flow && <p className="muted">{flow.txt}</p>}
        <button className="primary" disabled={!unsynced} onClick={() => markSynced(board, d.id)}>실물에 맞췄어요</button>
      </section>
    </div>
  );
}
