// M8 점검 (시안 MobChecks.dc.html, 2026-11-17 사용자 승인 예외): 믹서 그림 위 배지로 보이는 사항을 목록으로 모은다.
// 설명 문구는 홈의 배지와 같은 데이터(overview.json devices)를 쓴다.
import { useState } from 'react';
import { OVERVIEW as OV } from '../data';
import { BottomSheet, PageHeader } from '../components/Common';

type Grade = 'err' | 'warn' | 'note';
const LIST: [string, Grade, string][] = [
  ['Mps', 'err', 'MPS1200 서브 앰프 · 자모실'],
  ['Ag', 'warn', 'Yamaha AG06 · CH1 +48V'],
  ['Qsc', 'warn', 'QSC 메인 앰프 · 메인 스피커 R'],
  ['Dfx', 'note', 'Mackie DFX-12 · CH11/12'],
];
const G: Record<Grade, { name: string; dot: string; fg: string; mark: string; bg: string }> = {
  err: { name: '오류', dot: '#ff3b30', fg: '#fff', mark: '×', bg: 'var(--err)' },
  warn: { name: '주의', dot: '#ff9500', fg: '#1d1d1f', mark: '!', bg: 'var(--warn)' },
  note: { name: '참고', dot: '#0a84ff', fg: '#fff', mark: 'i', bg: 'var(--info)' },
};

export function Checks() {
  const [f, setF] = useState<'all' | Grade>('all');
  const [sel, setSel] = useState('');
  const cnt = (g: Grade) => LIST.filter((x) => x[1] === g).length;
  const chips: ['all' | Grade, string][] = [['all', '전체 ' + LIST.length], ['err', '오류 ' + cnt('err')], ['warn', '주의 ' + cnt('warn')], ['note', '참고 ' + cnt('note')]];
  const vis = LIST.filter((x) => f === 'all' || x[1] === f);
  const cur = LIST.find((x) => x[0] === sel);
  const it = cur ? OV.devices[cur[0]] : null;

  return (
    <>
      <PageHeader title="점검">
        <div className="chips" role="group" aria-label="등급 고르기">
          {chips.map(([k, l]) => <button key={k} className={'chip' + (f === k ? ' primary' : '')} aria-pressed={f === k} onClick={() => setF(k)}>{l}</button>)}
        </div>
      </PageHeader>
      <main className="main list">
        <p className="ck-intro">믹서 그림 위 배지(!)로 보이는 것들을 모았어요. 누르면 원인과 확인할 것을 보여 줘요.</p>
        <div className="w-rows">
          {vis.map(([k, g, where]) => (
            <button key={k} className="w-row cable ck-row" onClick={() => setSel(k)}>
              <span className="ck-mark" style={{ background: G[g].dot, color: G[g].fg }} aria-hidden="true">{G[g].mark}</span>
              <span className="w-txt"><span className="from">{OV.devices[k].title}</span><span className="sub13">{where}</span></span>
              <span className="badge" style={{ background: G[g].bg }}>{G[g].name}</span>
              <svg width="12" height="16" viewBox="0 0 12 16" fill="none" stroke="#7a7a7a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 2l6 6-6 6" /></svg>
            </button>
          ))}
          {vis.length === 0 && <div className="w-row cable"><span className="txt">이 등급의 알림은 없어요.</span></div>}
        </div>
      </main>
      {cur && it && (
        <BottomSheet label={it.title} title={it.title} onClose={() => setSel('')}>
          <div className="body">
            <div className="row"><span className="badge" style={{ background: it.bg }}>{it.badge}</span><span className="txt">{cur[2]}</span></div>
            <p className="txt">{it.l1}</p><p className="txt">{it.l2}</p><p className="txt">{it.l3}</p>
          </div>
        </BottomSheet>
      )}
    </>
  );
}
