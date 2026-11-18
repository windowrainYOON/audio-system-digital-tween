// M2~M4 패널 (시안 MobL4·MobDfx·MobAg06, 태블릿 Tab*P·L):
// 머리 "패널" + 연결 상태, 믹서 드롭다운 + 전원, 구역 드롭다운(L4는 +48V). (UI_GUIDE 2.4, 4장 M2~M4)
// 패널은 +/−·두 손가락으로 ×0.5~×3 확대, 상하좌우 자유 스크롤.
// 인스펙터: 모바일은 컨트롤을 누르면 아래에서 올라오고 빈 곳을 탭하면 내려간다(2.3).
// 태블릿은 오른쪽 380px 고정 상자로 늘 보인다(2026-11-17 사용자 결정, 4.T).
import { useCallback, useRef, useState } from 'react';
import { PROFILES } from '../data';
import type { BoardId } from '../data/types';
import { Panel } from '../components/Panel';
import { Inspector } from '../components/Inspector';
import { Dropdown, isBackgroundTap, PageHeader, usePinch, useShut } from '../components/Common';
import { flowFor, pickForJack } from '../lib/flow';
import { inspect } from '../lib/inspect';
import { go } from '../nav';
import { useLayout } from '../lib/layout';
import { markSynced, setPhantom, setPower, setValue, useStore } from '../store/store';

const ORDER: { b: BoardId; name: string; sub: string }[] = [
  { b: 'l4', name: 'L4', sub: '서브 믹서 · CD·PC' },
  { b: 'dfx12', name: 'DFX-12', sub: '메인 믹서' },
  { b: 'ag06', name: 'AG06', sub: '서브 믹서 · 키보드·드럼' },
];
/** 태블릿 오른쪽 인스펙터 폭(CSS clamp(300px, 34vw, 380px)) + 여백 */
const inspW = () => Math.max(300, Math.min(380, window.innerWidth * 0.34)) + 16 + 16;

export function DeviceDetail({ board }: { board: BoardId }) {
  const p = PROFILES[board];
  const st = useStore((s) => s.boards[board]);
  const [selBy, setSelBy] = useState<Partial<Record<BoardId, string>>>({});
  const [secBy, setSecBy] = useState<Partial<Record<BoardId, number>>>({});
  const [zBy, setZBy] = useState<Record<string, number>>({});
  const pan = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const { closing, close } = useShut(() => setOpen(false));
  const d = p.controls.find((c) => c.id === selBy[board]) ?? p.controls[0];
  const v = st.vals[d.id] ?? d.def;
  const info = inspect(board, d.id, st);
  const power = st.power !== false;
  const [vx, vy, vw] = p.viewBox;
  const lay = useLayout();
  const tablet = lay !== 'mobile';
  // 배율 1 = 시안 모바일 패널 크기(p.size). 태블릿 기본 배율은 인스펙터를 뺀 폭에 맞춤(0.7~1.6).
  const z0 = tablet ? Math.max(0.7, Math.min(1.6, (window.innerWidth - 24 - inspW()) / p.size[0])) : 1;
  const zk = board + lay;
  const z = zBy[zk] ?? z0;
  const setZ = (nz: number) => setZBy({ ...zBy, [zk]: Math.max(0.5, Math.min(3, Math.round(nz * 100) / 100)) });
  const pinch = usePinch(z, setZ, 0.5, 3);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const panRef = useCallback((n: HTMLElement | null) => { pan.current = n; pinch(n); }, [pinch]);
  const width = Math.round(p.size[0] * z);
  const k = width / vw;
  const sec = secBy[board] ?? 0;
  const jump = (i: number) => {
    const [, x, y] = p.chips[i];
    setSecBy({ ...secBy, [board]: i });
    pan.current?.scrollTo({ left: Math.max(0, (x - vx) * k - 12), top: Math.max(0, (y - vy) * k - 12), behavior: 'smooth' });
  };
  const cur = ORDER.find((o) => o.b === board)!;
  const shown = tablet || open;

  return (
    <>
      <PageHeader title="패널" className="det">
        <div className="ph-row">
          <Dropdown ariaLabel="믹서 고르기" value={cur.name} sub={cur.sub} current={board} onPick={(b) => go('panel', b as BoardId)}
            items={ORDER.map((o) => ({ key: o.b, label: o.name, sub: o.sub }))} />
          <button className="power" style={{ background: power ? '#2DD4BF' : '#5E6166', color: power ? '#0B1F1D' : '#fff' }}
            aria-pressed={power} onClick={() => setPower(board, !power)}>{power ? '전원 ON' : '전원 OFF'}</button>
        </div>
        <div className="ph-row">
          <Dropdown ariaLabel="패널 구역 고르기" white value={p.chips[sec][0]} sub={(sec + 1) + ' / ' + p.chips.length} current={String(sec)}
            items={p.chips.map((c, i) => ({ key: String(i), label: c[0] }))} onPick={(i) => jump(Number(i))} />
          {p.phantom && (
            <button className="power" style={{ background: 'var(--fill3)', color: 'var(--label)' }} aria-pressed={!!st.phantom}
              onClick={() => setPhantom(board, !st.phantom)}>{st.phantom ? '+48V ON' : '+48V OFF'}</button>
          )}
        </div>
      </PageHeader>
      <div className={'det-body ' + lay}>
        <div className="pan-wrap">
          <main ref={panRef} className="pan" aria-label={p.title + ' 믹서 패널'}
            onClick={(e) => { if (!tablet && open && isBackgroundTap(e)) close(); }}>
            <Panel profile={p} state={st} selected={d.id} flow={flowFor(p, d.id)} label={p.title + ' 믹서 패널 그림'} width={width}
              onPick={(id) => { setSelBy({ ...selBy, [board]: id }); setOpen(true); }}
              onJack={(i) => setSelBy({ ...selBy, [board]: pickForJack(p, i) })} />
            {!tablet && <div style={{ height: open ? 520 : 100 }} aria-hidden="true" />}
          </main>
        </div>
        {shown && (
          <Inspector d={d} v={v} info={info} unsynced={st.synced[d.id] === false} docked={tablet} closing={closing}
            onHide={tablet ? undefined : close} onChange={(nv) => setValue(board, d.id, nv)} onSynced={() => markSynced(board, d.id)} />
        )}
      </div>
    </>
  );
}
