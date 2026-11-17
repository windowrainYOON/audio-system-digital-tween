// 둥근 인스펙터: 고른 컨트롤과 같은 모양의 큰 노브·페이더를 돌리거나 끌어서, 또는 숫자로 값을 바꾼다.
import { useEffect, useState } from 'react';
import type { ControlDef } from '../data/types';
import { clamp01, knobAngle, readout } from '../lib/convert';

const TICKS = Array.from({ length: 11 }, (_, i) => {
  const a = ((-135 + 27 * i) * Math.PI) / 180;
  const big = i === 0 || i === 5 || i === 10;
  const r1 = 53, r2 = 59;
  return { x1: 66 + r1 * Math.sin(a), y1: 66 - r1 * Math.cos(a), x2: 66 + r2 * Math.sin(a), y2: 66 - r2 * Math.cos(a), w: big ? 2 : 1 };
});

type PE = React.PointerEvent<SVGSVGElement>;
const capture = (e: PE) => { e.preventDefault(); try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* 무시 */ } };

function Dial({ d, v, set }: { d: Extract<ControlDef, { type: 'knob' }>; v: number; set: (v: number) => void }) {
  const on = (e: PE) => {
    if (e.type === 'pointermove' && !(e.buttons & 1)) return;
    if (e.type === 'pointerdown') capture(e);
    const r = e.currentTarget.getBoundingClientRect();
    const a = Math.max(-135, Math.min(135, (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI));
    set((a + 135) / 270);
  };
  return (
    <svg width="132" height="132" viewBox="0 0 132 132" onPointerDown={on} onPointerMove={on} aria-hidden="true"
      style={{ touchAction: 'none', cursor: 'grab', display: 'block' }}>
      {TICKS.map((t, i) => <line key={i} {...t} stroke="#8e8e93" strokeWidth={t.w} strokeLinecap="round" />)}
      <text x="30.1" y="115.9" fontSize="11" fill="#6e6e73" textAnchor="middle">0</text>
      <text x="101.9" y="115.9" fontSize="11" fill="#6e6e73" textAnchor="middle">10</text>
      <circle cx="66" cy="66" r="42" fill={d.cap} stroke="#48484a" strokeWidth="2" />
      <line x1="66" y1="30" x2="66" y2="50" stroke={d.ptr} strokeWidth="5" strokeLinecap="round" transform={`rotate(${knobAngle(v)} 66 66)`} />
    </svg>
  );
}

function BigFader({ v, set }: { v: number; set: (v: number) => void }) {
  const on = (e: PE) => {
    if (e.type === 'pointermove' && !(e.buttons & 1)) return;
    if (e.type === 'pointerdown') capture(e);
    const r = e.currentTarget.getBoundingClientRect();
    set(1 - (((e.clientY - r.top) * 156) / r.height - 10) / 136);
  };
  const y = 10 + (1 - v) * 136;
  return (
    <svg width="64" height="156" viewBox="0 0 64 156" onPointerDown={on} onPointerMove={on} aria-hidden="true"
      style={{ touchAction: 'none', cursor: 'grab', display: 'block' }}>
      <rect x="28" y="10" width="8" height="136" rx="4" fill="#1d1d1f" />
      {Array.from({ length: 11 }, (_, i) => <line key={i} x1="16" y1={10 + i * 13.6} x2="22" y2={10 + i * 13.6} stroke="#8e8e93" strokeWidth="1.5" />)}
      <rect x="12" y={y - 11} width="40" height="22" rx="4" fill="#f1f1f1" stroke="#48484a" strokeWidth="2" />
      <line x1="14" y1={y} x2="50" y2={y} stroke="#1d1d1f" strokeWidth="2" />
    </svg>
  );
}

interface Props {
  d: ControlDef; v: number; unsynced: boolean; flowText?: string;
  onChange: (v: number) => void; onSynced: () => void;
}

export function Inspector({ d, v, unsynced, flowText, onChange, onSynced }: Props) {
  const [more, setMore] = useState(false);
  const [text, setText] = useState('');
  const r = readout(d, v);
  const set = (nv: number) => {
    let x = clamp01(nv);
    if (d.kind === 'fx') x = Math.round(x * 15) / 15; // 이펙트 선택 노브는 16칸
    onChange(Math.round(x * 1000) / 1000);
  };
  useEffect(() => { setText((v * 10).toFixed(1)); }, [v, d.id]);
  const commit = () => { const n = Number(text.replace(',', '.')); if (Number.isFinite(n)) set(n / 10); else setText((v * 10).toFixed(1)); };

  return (
    <section className="card sheet" aria-label="선택한 컨트롤">
      <div className="row">
        <div className="title">{d.name}</div>
        <span className="pill" style={unsynced ? { background: '#fff3d6', color: '#7a4b00' } : { background: '#DDF5EE', color: '#0B4F47' }}>
          {unsynced ? '실물 확인 필요' : '실물과 일치'}
        </span>
      </div>
      {flowText && <div className="flowbox"><b>신호 흐름</b> · {flowText}</div>}

      {d.type === 'button' ? (
        <button className="toggle" aria-pressed={v === 1} onClick={() => set(v === 1 ? 0 : 1)}>
          {v === 1 ? 'ON (눌러서 끄기)' : 'OFF (눌러서 켜기)'}
        </button>
      ) : (
        <>
          <div className="dialrow">
            <button className="step" aria-label="조금 줄이기" onClick={() => set(v - 0.05)}>−</button>
            {d.type === 'knob' ? <Dial d={d} v={v} set={set} /> : <BigFader v={v} set={set} />}
            <button className="step" aria-label="조금 올리기" onClick={() => set(v + 0.05)}>+</button>
          </div>
          <div className="readout">
            {d.type === 'knob' && <span>시계 <b>{r.hour}</b></span>}
            <label className="num">눈금
              <input inputMode="decimal" value={text} aria-label={d.name + ' 눈금 (0~10)'}
                onChange={(e) => setText(e.target.value)} onBlur={commit}
                onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }} />
              <span className="muted">/ 10</span>
            </label>
            <span><b>{r.db}</b></span>
          </div>
          <input className="range" type="range" min={0} max={1} step={0.01} value={v} aria-label={d.name + ' 값'}
            onChange={(e) => set(Number(e.target.value))} />
        </>
      )}

      {(d.desc || d.src) && (
        <>
          <button className="link" aria-expanded={more} onClick={() => setMore(!more)}>{more ? '설명 접기' : '설명 보기'}</button>
          {more && (
            <div className="desc">
              {d.desc && <p>{d.desc}</p>}
              {d.src && <p className="muted">연결: {d.src}</p>}
              <p className="muted small">값↔dB는 보정 전 대략값이에요.</p>
            </div>
          )}
        </>
      )}
      <button className="primary" disabled={!unsynced} onClick={onSynced}>{unsynced ? '실물에 맞췄어요' : '실물과 일치해요'}</button>
    </section>
  );
}
