// 둥근 인스펙터 (시안 M2~M4). 화면 아래에 고정되고, 컨트롤을 누르면 뜨고, 숨기면 우측 하단 버튼으로 접힌다.: 이름+배지 → 신호 흐름 → 큰 노브/페이더(−/+) 또는 ON/OFF 토글
// → 값 박스(눈금·아날로그·시계) → "이 컨트롤이 하는 일" (접힘) → "실물에 맞췄어요".
import { useEffect, useState } from 'react';
import type { ControlDef } from '../data/types';
import { clamp01, knobAngle } from '../lib/convert';
import type { Inspect } from '../lib/inspect';

const TICKS = Array.from({ length: 11 }, (_, i) => {
  const a = ((-135 + 27 * i) * Math.PI) / 180;
  const big = i === 0 || i === 5 || i === 10;
  return { x1: 66 + 53 * Math.sin(a), y1: 66 - 53 * Math.cos(a), x2: 66 + 59 * Math.sin(a), y2: 66 - 59 * Math.cos(a), w: big ? 2 : 1 };
});

type PE = React.PointerEvent<SVGSVGElement>;
const capture = (e: PE) => { e.preventDefault(); try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* 무시 */ } };

function Dial({ cap, ptr, v, set, label }: { cap: string; ptr: string; v: number; set: (v: number) => void; label: string }) {
  const on = (e: PE) => {
    if (e.type === 'pointermove' && !(e.buttons & 1)) return;
    if (e.type === 'pointerdown') capture(e);
    const r = e.currentTarget.getBoundingClientRect();
    const a = Math.max(-135, Math.min(135, (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI));
    set((a + 135) / 270);
  };
  return (
    <svg width="132" height="132" viewBox="0 0 132 132" onPointerDown={on} onPointerMove={on} role="img" aria-label={label + ' 노브. 돌려서 조절'}
      style={{ touchAction: 'none', cursor: 'grab', display: 'block' }}>
      {TICKS.map((t, i) => <line key={i} {...t} stroke="#8e8e93" strokeWidth={t.w} strokeLinecap="round" />)}
      <text x="30.1" y="115.9" fontSize="11" fill="#6e6e73" textAnchor="middle">0</text>
      <text x="101.9" y="115.9" fontSize="11" fill="#6e6e73" textAnchor="middle">10</text>
      <circle cx="66" cy="66" r="42" fill={cap} stroke="#48484a" strokeWidth="2" />
      <line x1="66" y1="30" x2="66" y2="50" stroke={ptr} strokeWidth="5" strokeLinecap="round" transform={`rotate(${knobAngle(v)} 66 66)`} />
    </svg>
  );
}

function BigFader({ v, set, label, cap }: { v: number; set: (v: number) => void; label: string; cap: string }) {
  const on = (e: PE) => {
    if (e.type === 'pointermove' && !(e.buttons & 1)) return;
    if (e.type === 'pointerdown') capture(e);
    const r = e.currentTarget.getBoundingClientRect();
    set(1 - (((e.clientY - r.top) * 156) / r.height - 10) / 136);
  };
  const y = 10 + (1 - v) * 136;
  return (
    <svg width="64" height="156" viewBox="0 0 64 156" onPointerDown={on} onPointerMove={on} role="img" aria-label={label + ' 페이더. 끌어서 조절'}
      style={{ touchAction: 'none', cursor: 'grab', display: 'block' }}>
      <rect x="28" y="10" width="8" height="136" rx="4" fill="#1d1d1f" />
      {Array.from({ length: 11 }, (_, i) => <line key={i} x1="16" y1={10 + i * 13.6} x2="22" y2={10 + i * 13.6} stroke="#8e8e93" strokeWidth="1.5" />)}
      <rect x="10" y={y - 11} width="44" height="22" rx="4" fill={cap} stroke="#48484a" strokeWidth="2" />
      <line x1="12" y1={y} x2="52" y2={y} stroke="#1d1d1f" strokeWidth="2" />
    </svg>
  );
}

interface Props { d: ControlDef; v: number; unsynced: boolean; info: Inspect; onChange: (v: number) => void; onSynced: () => void; onHide: () => void }

export function Inspector({ d, v, unsynced, info, onChange, onSynced, onHide }: Props) {
  const [more, setMore] = useState(false);
  const [text, setText] = useState('');
  const set = (nv: number) => {
    let x = clamp01(nv);
    if (d.kind === 'fx') x = Math.round(x * 15) / 15; // 이펙트 선택 16칸 (시안 onSlide)
    onChange(Math.round(x * 1000) / 1000);
  };
  useEffect(() => { setText((v * 10).toFixed(1)); }, [v, d.id]);
  const commit = () => { const n = Number(text.replace(',', '.')); if (Number.isFinite(n)) set(n / 10); else setText((v * 10).toFixed(1)); };

  return (
    <section className="sheet insp" aria-label="선택한 컨트롤">
      <div className="row">
        <div className="ttl">{info.name}</div>
        <span className="badge" style={unsynced ? { background: '#fff3d6', color: '#7a4b00' } : { background: '#DDF5EE', color: '#0B4F47' }}>
          {unsynced ? '실물 확인 필요' : '실물과 일치'}
        </span>
        <button className="hide" aria-label="인스펙터 숨기기" onClick={onHide}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M2 5l5 5 5-5" /></svg>
        </button>
      </div>
      {info.flowText && <div className="flowbox"><b>신호 흐름</b> · {info.flowText}</div>}
      <div className="body">
        {d.type === 'button' ? (
          <button className="btn-fill" aria-pressed={v === 1} onClick={() => set(v === 1 ? 0 : 1)}>
            {v === 1 ? 'ON (눌러서 끄기)' : 'OFF (눌러서 켜기)'}
          </button>
        ) : (
          <div className="dialrow" style={d.type === 'fader' ? { gap: 16 } : undefined}>
            <button className="step" aria-label={d.type === 'knob' ? '조금 줄이기' : '조금 내리기'} onClick={() => set(v - 0.05)}>−</button>
            {d.type === 'knob'
              ? <Dial cap={d.cap} ptr={d.ptr} v={v} set={set} label={info.name} />
              : <BigFader v={v} set={set} label={info.name} cap={d.handle.fill} />}
            <button className="step" aria-label="조금 올리기" onClick={() => set(v + 0.05)}>+</button>
          </div>
        )}
        <div className="valbox">
          {d.type !== 'button' && (
            <div className="row" style={{ gap: 16 }}>
              <label><span className="k">눈금 </span>
                <input inputMode="decimal" value={text} aria-label={info.name + ' 눈금 (0~10) 직접 입력'}
                  onChange={(e) => setText(e.target.value)} onBlur={commit}
                  onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }} />
              </label>
              {d.type === 'knob' && <span><span className="k">시계 </span><b>{info.hour}</b></span>}
            </div>
          )}
          <div><span className="k">아날로그 </span><b>{info.db}</b></div>
        </div>
        <button className="more" aria-expanded={more} onClick={() => setMore(!more)}>{more ? '이 컨트롤이 하는 일 ▴' : '이 컨트롤이 하는 일 ▾'}</button>
        {more && (
          <div className="morebox">
            <div><div className="h">이 컨트롤은</div><div className="b">{info.desc}</div></div>
            <div><div className="h">연결된 소스</div><div className="b">{info.src}</div></div>
            <div><div className="h">조작하면</div><div className="b">{info.eff}</div></div>
            <div className="note">일반적인 믹서 동작 설명이에요. 실물 사양과 다르면 알려 주세요.</div>
          </div>
        )}
      </div>
      <button className="btn-primary" onClick={onSynced} disabled={!unsynced}>실물에 맞췄어요</button>
    </section>
  );
}

/** 숨긴 인스펙터: 우측 하단의 둥근 버튼. 누르면 다시 뜬다. */
export function InspectorHandle({ name, unsynced, onOpen }: { name: string; unsynced: boolean; onOpen: () => void }) {
  return (
    <button className="insp-handle" onClick={onOpen} aria-label={name + ' 인스펙터 열기'}>
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="11" y1="11" x2="11" y2="4.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" transform="rotate(-40 11 11)" />
      </svg>
      <span>{name}</span>
      {unsynced && <i className="amber" aria-hidden="true" />}
    </button>
  );
}
