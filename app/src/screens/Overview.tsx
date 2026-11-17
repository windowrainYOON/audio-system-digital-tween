// M1 간략 보기 (시안 MobOverview): 실제 믹서 그림 3대 + 소스 12개 + 앰프·스피커 + 겹치지 않는 케이블.
import { useState } from 'react';
import { DEV_BOARD, OVERVIEW as OV } from '../data';
import { WiringDiagram } from '../components/WiringDiagram';
import { TopHeader } from '../components/TopHeader';
import { go } from '../nav';

export function Overview() {
  const [sel, setSel] = useState('Ag');
  const [src, setSrc] = useState('');
  const sv = src ? OV.sources[src] : null;
  const info = sv ? { ...sv, l3: OV.phones } : OV.devices[sel];
  const flow = sv ? sv.steps.concat(OV.post) : [];
  const target = sv ? DEV_BOARD[sv.dev] : DEV_BOARD[sel];

  return (
    <>
      <TopHeader full={false} />
      <div className="ov-body">
      <main className="main ov-draw">
        <svg viewBox={`0 0 ${OV.width} ${OV.height}`} width="100%" role="group" aria-label="전체 장비 간략 보기"
          style={{ display: 'block', fontFamily: 'Noto Sans KR, sans-serif' }}>
          <WiringDiagram src={src} sel={sel} onSource={setSrc} onDevice={(k) => { setSel(k); setSrc(''); }} />
        </svg>
      </main>
      <section className="sheet ov-info" aria-label="선택한 장비">
        <div className="row">
          <div className="ttl">{info.title}</div>
          <span className="badge" style={{ background: info.bg }}>{info.badge}</span>
        </div>
        {flow.length > 0 && (
          <div className="steps" aria-label="신호 흐름">
            {flow.map((f, i) => (
              <span key={i} className="st">{i > 0 && <span className="ar">→</span>}<span className="badge" style={{ background: f[1] }}>{f[0]}</span></span>
            ))}
          </div>
        )}
        <p className="txt">{info.l1}</p><p className="txt">{info.l2}</p><p className="txt">{info.l3}</p>
        <button className="btn-primary" onClick={() => (sel === 'Mps' && !sv ? go('wiring') : go('panel', target))}>{info.go}</button>
      </section>
      </div>
    </>
  );
}
