// 모든 화면이 함께 쓰는 골격 (UI_GUIDE 0장 0~0-3, 2.2~2.4):
// - PageHeader: 좌상단 페이지 제목 + 우상단 연결 상태(항상). 제목 바로 아래에 칩·드롭다운 줄.
// - useShut / BottomSheet: 아래에서 올라오고, 바깥(딤)을 탭하면 아래로 미끄러져 닫히는 팝업.
// - Dropdown: 스테퍼 대신 쓰는 "하나 고르기". 버튼 아래로 펼쳐지고 바깥을 탭하면 닫힌다.
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useStore } from '../store/store';
import { ConnectionSheet, LABEL } from '../screens/Connection';

/** 닫힘 애니메이션(220ms)을 보여 준 뒤 실제로 닫는다. */
export function useShut(onClose: () => void, ms = 220) {
  const [closing, setClosing] = useState(false);
  const cb = useRef(onClose);
  cb.current = onClose;
  const t = useRef(0);
  useEffect(() => () => clearTimeout(t.current), []);
  const close = useCallback(() => {
    setClosing(true);
    clearTimeout(t.current);
    t.current = window.setTimeout(() => { setClosing(false); cb.current(); }, ms);
  }, [ms]);
  return { closing, close };
}

/** 본문을 탭했는데 그 대상이 버튼·링크·컨트롤이 아니면 true (팝업 바깥 탭 판정, UI_GUIDE 2.3) */
export const isBackgroundTap = (e: { target: EventTarget | null }) => {
  const t = e.target as Element | null;
  return !(t && t.closest && t.closest('[role="button"],button,a,input,label,select,textarea'));
};

/** Escape 키로 닫기 */
export function useEscape(on: boolean, f: () => void) {
  const cb = useRef(f);
  cb.current = f;
  useEffect(() => {
    if (!on) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') cb.current(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [on]);
}

export function NetPill() {
  const net = useStore((s) => s.net);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={'netpill net-' + net} onClick={() => setOpen(true)} aria-label={'서버 연결 상태: ' + LABEL[net] + '. 눌러서 자세히 보기'}>
        <i className="dot" aria-hidden="true" />{LABEL[net]}
      </button>
      {open && <ConnectionSheet onClose={() => setOpen(false)} />}
    </>
  );
}

export function PageHeader({ title, children, className = '' }: { title: string; children?: ReactNode; className?: string }) {
  return (
    <header className={'ph ' + className}>
      <div className="ph-top"><h1>{title}</h1><NetPill /></div>
      {children}
    </header>
  );
}

/** 아래에서 올라오는 시트. 딤이나 닫기 버튼을 누르면 아래로 미끄러져 닫힌다. */
export function BottomSheet({ label, title, onClose, children, className = '' }: { label: string; title?: ReactNode; onClose: () => void; children: ReactNode | ((close: () => void) => ReactNode); className?: string }) {
  const { closing, close } = useShut(onClose);
  useEscape(true, close);
  return (
    <>
      <div className={'dim' + (closing ? ' closing' : '')} onClick={close} aria-hidden="true" />
      <section className={'bsheet pop ' + className + (closing ? ' closing' : '')} role="dialog" aria-modal="true" aria-label={label}>
        {title !== undefined && (
          <div className="row">
            <div className="ttl">{title}</div>
            <CloseBtn onClick={close} />
          </div>
        )}
        {typeof children === 'function' ? children(close) : children}
      </section>
    </>
  );
}

export function CloseBtn({ onClick, label = '닫기' }: { onClick: () => void; label?: string }) {
  return (
    <button className="hide" aria-label={label} onClick={onClick}>
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M2 5l5 5 5-5" /></svg>
    </button>
  );
}

export interface DDItem { key: string; label: string; sub?: string; head?: boolean; done?: string }

/** 드롭다운 (UI_GUIDE 2.4): 값 + 보조 글자 + 원형 쉐브론 캡. 메뉴는 버튼 아래로 펼쳐진다. */
export function Dropdown({ ariaLabel, value, sub, items, current, onPick, white, className = '' }: {
  ariaLabel: string; value: ReactNode; sub?: ReactNode; items: DDItem[]; current: string; onPick: (key: string) => void; white?: boolean; className?: string;
}) {
  const [open, setOpen] = useState(false);
  useEscape(open, () => setOpen(false));
  return (
    <div className={'dd ' + className}>
      <button className={'dd-btn' + (white ? ' white' : '')} aria-haspopup="listbox" aria-expanded={open} aria-label={ariaLabel} onClick={() => setOpen(!open)}>
        <span className="dd-val"><b>{value}</b>{sub && <span className="dd-sub"> · {sub}</span>}</span>
        <span className={'dd-chev' + (open ? ' up' : '')} aria-hidden="true">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 1.5L6 6l4.5-4.5" /></svg>
        </span>
      </button>
      {open && (
        <>
          <div className="dd-back" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="dd-menu" role="listbox" aria-label={ariaLabel}>
            {items.map((it) => it.head ? (
              <div key={'h-' + it.key} className="dd-head">{it.label}</div>
            ) : (
              <button key={it.key} role="option" aria-selected={it.key === current} className="dd-opt" onClick={() => { setOpen(false); onPick(it.key); }}>
                <span className="dd-ol"><span className={it.key === current ? 'on' : ''}>{it.label}</span>{it.sub && <span className="dd-sub"> · {it.sub}</span>}</span>
                {it.done && <span className="dd-done">{it.done}</span>}
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: it.key === current ? 1 : 0 }}><path d="M1.5 6.5l4 4 9-9" /></svg>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** 확대·축소 버튼 (홈·패널 공통, 오른쪽 위에 떠 있음) */

/** 두 손가락 벌리기·오므리기로 배율을 바꾼다(브라우저 화면 확대 대신). 한 손가락은 원래대로 스크롤. */
/** 두 손가락 핀치(트랙패드는 ctrl+휠)로 확대·축소 (2026-11-18 사용자 결정: +/− 버튼 없음).
 * 스크롤 상자에 ref를 단다. 손가락 가운데가 제자리에 머물게 스크롤을 맞춘다. 시안 tools/pinch.js와 같은 규칙. */
export function usePinch(z: number, setZ: (z: number) => void, min: number, max: number) {
  const zr = useRef(z); zr.current = z;
  const fr = useRef(setZ); fr.current = setZ;
  const el = useRef<HTMLElement | null>(null);
  const off = useRef<(() => void) | null>(null);
  return useCallback((node: HTMLElement | null) => {
    off.current?.(); off.current = null; el.current = node;
    if (!node) return;
    let d0 = 0, z0 = 1;
    const dist = (t: TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY) || 1;
    const zoomTo = (nz: number, cx: number, cy: number) => {
      const zp = zr.current; nz = Math.round(Math.max(min, Math.min(max, nz)) * 100) / 100;
      if (Math.abs(nz - zp) < 0.005) return;
      const r = node.getBoundingClientRect(); const px = cx - r.left, py = cy - r.top;
      const sx = ((node.scrollLeft + px) * nz) / zp - px, sy = ((node.scrollTop + py) * nz) / zp - py;
      zr.current = nz; fr.current(nz);
      requestAnimationFrame(() => { node.scrollLeft = sx; node.scrollTop = sy; });
    };
    const ts = (e: TouchEvent) => { if (e.touches.length === 2) { d0 = dist(e.touches); z0 = zr.current; } };
    const tm = (e: TouchEvent) => { if (!d0 || e.touches.length !== 2) return; e.preventDefault(); const t = e.touches; zoomTo((z0 * dist(t)) / d0, (t[0].clientX + t[1].clientX) / 2, (t[0].clientY + t[1].clientY) / 2); };
    const te = (e: TouchEvent) => { if (e.touches.length < 2) d0 = 0; };
    const wh = (e: WheelEvent) => { if (!e.ctrlKey) return; e.preventDefault(); zoomTo(zr.current * Math.exp(-e.deltaY / 150), e.clientX, e.clientY); };
    // iOS 사파리 제스처(화면 전체 확대) 막기
    const gs = (e: Event) => e.preventDefault();
    node.addEventListener('touchstart', ts, { passive: true });
    node.addEventListener('touchmove', tm, { passive: false });
    node.addEventListener('touchend', te, { passive: true });
    node.addEventListener('wheel', wh, { passive: false });
    node.addEventListener('gesturestart', gs as EventListener, { passive: false } as AddEventListenerOptions);
    off.current = () => { node.removeEventListener('touchstart', ts); node.removeEventListener('touchmove', tm); node.removeEventListener('touchend', te); node.removeEventListener('wheel', wh); node.removeEventListener('gesturestart', gs as EventListener); };
  }, [min, max]);
}
