// M1 홈 = 상세 보기 (시안 MobOverview, 2026-11-17): 칩 없이 실제 믹서 그림 3대 + 소스 12개 + 앰프·스피커 + 케이블.
// 오른쪽 위 +/−·두 손가락으로 ×1~×3 확대, 상하좌우 스크롤. 소스·장비를 누르면 아래 정보 상자가 올라오고,
// 그림의 빈 곳을 탭하면 아래로 내려간다(UI_GUIDE 2.3). 다른 페이지로 가는 버튼은 두지 않는다(이동은 탭바만).
import { useState } from 'react';
import { OVERVIEW as OV } from '../data';
import { WiringDiagram } from '../components/WiringDiagram';
import { CloseBtn, isBackgroundTap, PageHeader, usePinch, useShut, ZoomButtons } from '../components/Common';
import { useLayout } from '../lib/layout';

const BASE = 358; // 시안 M1 그림 폭(px, 배율 1)

export function Overview() {
  const lay = useLayout();
  const [sel, setSel] = useState('Ag');
  const [src, setSrc] = useState('');
  const [open, setOpen] = useState(true);
  const [zBy, setZBy] = useState<Record<string, number>>({});
  const min = lay === 'mobile' ? 1 : 0.75;
  const z = zBy[lay] ?? (lay === 'tabletL' ? 1.5 : lay === 'tabletP' ? 1.2 : 1);
  const setZ = (nz: number) => setZBy({ ...zBy, [lay]: Math.max(min, Math.min(3, nz)) });
  const pinch = usePinch(z, setZ, min, 3);
  const { closing, close } = useShut(() => setOpen(false));
  const sv = src ? OV.sources[src] : null;
  const info = sv ? { ...sv, l3: OV.phones } : OV.devices[sel];
  const flow = sv ? sv.steps.concat(OV.post) : [];
  const w = Math.round(BASE * z);

  return (
    <>
      <PageHeader title="홈" />
      <div className="ov-wrap">
        <ZoomButtons onIn={() => setZ(z + 0.5)} onOut={() => setZ(z - 0.5)} />
        <main className="main ov-draw" onClick={(e) => { if (open && isBackgroundTap(e)) close(); }} {...pinch}>
          <svg viewBox={`0 0 ${OV.width} ${OV.height}`} width={w} height={Math.round((w * OV.height) / OV.width)} role="group" aria-label="전체 장비 그림"
            style={{ display: 'block', margin: '0 auto', fontFamily: 'Noto Sans KR, sans-serif' }}>
            <WiringDiagram src={src} sel={sel} onSource={(k) => { setSrc(k); setOpen(true); }} onDevice={(k) => { setSel(k); setSrc(''); setOpen(true); }} />
          </svg>
          <div style={{ height: open ? 380 : 100 }} aria-hidden="true" />
        </main>
      </div>
      {open && (
        <section className={'sheet pop ov-info' + (closing ? ' closing' : '')} aria-label="선택한 장비">
          <div className="row">
            <div className="ttl">{info.title}</div>
            <span className="badge" style={{ background: info.bg }}>{info.badge}</span>
            <CloseBtn onClick={close} />
          </div>
          {flow.length > 0 && (
            <div className="steps" aria-label="신호 흐름">
              {flow.map((f, i) => (
                <span key={i} className="st">{i > 0 && <span className="ar">→</span>}<span className="badge" style={{ background: f[1] }}>{f[0]}</span></span>
              ))}
            </div>
          )}
          <p className="txt">{info.l1}</p><p className="txt">{info.l2}</p><p className="txt">{info.l3}</p>
        </section>
      )}
    </>
  );
}
