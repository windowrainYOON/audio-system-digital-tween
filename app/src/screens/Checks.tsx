// M8 점검 (시안 MobChecks.dc.html): 배선 변경과 믹서 그림 위 배지로 보이는 사항을 목록으로 모은다.
// 2026-11-18 사용자 결정:
// - 확인 안 한 배선 변경이 있으면 맨 위 '배선 변경 N개'. 열면 원래 단자 → 지금 단자, '실물에도 똑같이 옮겼어요 · 확인'을
//   누르면 실물에도 옮긴 것으로 보고 알림·홈 노란 선·배선 탭 카드를 함께 지운다(wiring.ack·ackCur).
// - 주의 사항은 '확인했어요'를 누르거나 조치하면(AG06 +48V 끔) 옆에 '해결' 칩. 공유 키 `checks`.
import { useState } from 'react';
import { BottomSheet, PageHeader } from '../components/Common';
import { changesOf, sigOf } from '../lib/ovwires';
import { ackWiring, setCheck, useStore } from '../store/store';

type Grade = 'chg' | 'err' | 'warn' | 'note';
const LIST: [string, Grade, string][] = [
  ['Mps', 'err', 'MPS1200 서브 앰프 · 자모실'],
  ['Ag', 'warn', 'Yamaha AG06 · CH1 +48V'],
  ['Qsc', 'warn', 'QSC 메인 앰프 · 메인 스피커 R'],
  ['Dfx', 'note', 'Mackie DFX-12 · CH11/12'],
];
/** 점검 탭 문구는 시안 MobChecks의 원래 주의 사항 문구(홈에서는 더 띄우지 않는다) */
const INFO: Record<string, { title: string; badge: string; bg: string; l1: string; l2: string; l3: string }> = {
  Ag: { title: 'Yamaha AG06', badge: '주의 1', bg: 'var(--warn)', l1: '+48V(팬텀)가 켜져 있어요. CH1 DI BOX가 패시브면 끄는 것이 안전해요.', l2: '키보드는 TRS 출력을 TS 2줄로 나눠 3/4에, 드럼은 TS 모노 2줄→RCA로 5/6에 연결해요.', l3: 'STEREO OUT → DFX-12 9/10 L·R' },
  Dfx: { title: 'Mackie DFX-12', badge: '참고 1', bg: 'var(--info)', l1: '11/12번만 비어 있어요(안 쓰는 채널은 페이더를 맨 아래로). 5/6번은 매립형 라인이 이어져 있어요.', l2: '1·2번 강대상1 구즈넥 L·R, 3·4·5/6번 매립형 XLR(기도석·아래강대상), 7/8번 무선, 9/10번 AG06, CD/TAPE IN은 L4.', l3: 'MAIN OUT L·R(XLR) → QSC, PHONES → MPS1200.' },
  Qsc: { title: 'R 스피커가 약해요', badge: '주의 · 이슈 #1', bg: 'var(--warn)', l1: '1) L·R 스피커 케이블을 바꿔 꽂아 보세요.', l2: '2) R 스피커만 따로 테스트 음원으로 확인하세요.', l3: '3) QSC R 채널 게인 노브 위치와 DFX-12 MAIN R 페이더를 확인하세요.' },
  Mps: { title: 'MPS1200 CH1 고장', badge: '오류', bg: 'var(--err)', l1: 'MPS1200은 자모실 스피커용 서브 앰프예요. CH1 채널이 고장났어요.', l2: '자모실 스피커가 CH1에 연결돼 있는지 확인이 필요해요. 모니터 스피커는 메인 스피커에서 이어지는 구성이라 MPS1200과 무관해요.', l3: 'DFX-12 PHONES → MPS1200 입력은 그대로 연결돼 있어요.' },
};
const G: Record<Grade, { name: string; dot: string; fg: string; mark: string; bg: string }> = {
  chg: { name: '변경', dot: '#FFD60A', fg: '#1d1d1f', mark: '↔', bg: '#fff6bf' },
  err: { name: '오류', dot: '#ff3b30', fg: '#fff', mark: '×', bg: 'var(--err)' },
  warn: { name: '주의', dot: '#ff9500', fg: '#1d1d1f', mark: '!', bg: 'var(--warn)' },
  note: { name: '참고', dot: '#0a84ff', fg: '#fff', mark: 'i', bg: 'var(--info)' },
};
const SOLVED = { background: '#dff5e3', color: '#1b7a34', fontWeight: 700 } as const;

export function Checks() {
  const [f, setF] = useState<'all' | Grade>('all');
  const [sel, setSel] = useState('');
  const doc = useStore((s) => s.wiring);
  const res = useStore((s) => s.checks?.res) || {};
  const phantom = useStore((s) => s.boards.ag06.phantom);
  const chg = changesOf(doc);
  const list: [string, Grade, string][] = (chg.length ? [['Wch', 'chg', '배선 탭에서 바꾼 연결 · 실물 확인 필요'] as [string, Grade, string]] : []).concat(LIST);
  const fixed = (k: string) => (k === 'Ag' && phantom === false ? '+48V를 껐어요.' : '');
  const solved = (k: string) => !!(res[k] || fixed(k));
  const cnt = (g: Grade) => list.filter((x) => x[1] === g).length;
  const chips: ['all' | Grade, string][] = [['all', '전체 ' + list.length], ...(chg.length ? [['chg', '변경 1'] as ['chg', string]] : []), ['err', '오류 ' + cnt('err')], ['warn', '주의 ' + cnt('warn')], ['note', '참고 ' + cnt('note')]];
  const vis = list.filter((x) => f === 'all' || x[1] === f);
  const cur = list.find((x) => x[0] === sel);
  const title = (k: string) => (k === 'Wch' ? '배선 변경 ' + chg.length + '개' : INFO[k].title);

  return (
    <>
      <PageHeader title="점검">
        <div className="chips" role="group" aria-label="등급 고르기">
          {chips.map(([k, l]) => <button key={k} className={'chip' + (f === k ? ' primary' : '')} aria-pressed={f === k} onClick={() => setF(k)}>{l}</button>)}
        </div>
      </PageHeader>
      <main className="main list">
        <p className="ck-intro">배선 변경과 믹서 그림 위 배지(!)로 보이는 것들을 모았어요. 누르면 내용을 보여 주고, 확인하면 옆에 해결 칩이 붙어요.</p>
        <div className="w-rows">
          {vis.map(([k, g, where]) => {
            const ok = k !== 'Wch' && solved(k);
            return (
              <button key={k} className="w-row cable ck-row" onClick={() => setSel(k)}>
                <span className="ck-mark" style={{ background: ok ? '#34c759' : G[g].dot, color: ok ? '#fff' : G[g].fg }} aria-hidden="true">{ok ? '✓' : G[g].mark}</span>
                <span className="w-txt"><span className="from">{title(k)}</span><span className="sub13">{where}</span></span>
                {ok && <span className="badge" style={SOLVED}>해결</span>}
                <span className="badge" style={{ background: G[g].bg, opacity: ok ? 0.55 : 1 }}>{G[g].name}</span>
                <svg width="12" height="16" viewBox="0 0 12 16" fill="none" stroke="#7a7a7a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 2l6 6-6 6" /></svg>
              </button>
            );
          })}
          {vis.length === 0 && <div className="w-row cable"><span className="txt">이 등급의 알림은 없어요.</span></div>}
        </div>
      </main>
      {cur && cur[0] === 'Wch' && doc && (
        <BottomSheet label="배선 변경" title={title('Wch')} onClose={() => setSel('')}>
          {(close) => (
            <div className="body">
              <div className="row"><span className="badge" style={{ background: G.chg.bg }}>변경</span><span className="txt">{cur[2]}</span></div>
              <p className="txt">배선 탭에서 바꾼 연결이에요. 홈 배선도에는 노란 선으로 보여요.</p>
              <p className="txt">실물 케이블도 같은 단자로 옮긴 뒤 확인을 눌러 주세요.</p>
              <div className="ck-chg">
                {chg.map((c) => (
                  <div key={c.id} className="ck-chg-row"><b>{c.name}</b><span><s>{c.from}</s> → <b>{c.to}</b></span></div>
                ))}
              </div>
              <button className="btn-primary big" onClick={() => { ackWiring(sigOf(doc)); close(); }}>실물에도 똑같이 옮겼어요 · 확인</button>
            </div>
          )}
        </BottomSheet>
      )}
      {cur && cur[0] !== 'Wch' && (
        <BottomSheet label={INFO[cur[0]].title} title={INFO[cur[0]].title} onClose={() => setSel('')}>
          {(close) => {
            const k = cur[0], it = INFO[k], ok = solved(k), auto = !!fixed(k) && !res[k];
            return (
              <div className="body">
                <div className="row"><span className="badge" style={{ background: it.bg }}>{it.badge}</span><span className="txt">{cur[2]}</span></div>
                <p className="txt">{it.l1}</p><p className="txt">{it.l2}</p><p className="txt">{it.l3}</p>
                {ok && <div className="row" role="status"><span className="badge" style={SOLVED}>해결</span><span className="txt">{fixed(k) || '확인했어요.'}</span></div>}
                {!ok && <button className="btn-primary big" onClick={() => { setCheck(k, true); close(); }}>확인했어요</button>}
                {ok && !auto && <button className="btn-fill accent" onClick={() => setCheck(k, false)}>해결 취소</button>}
                {ok && auto && <button className="btn-fill accent" onClick={close}>닫기</button>}
              </div>
            );
          }}
        </BottomSheet>
      )}
    </>
  );
}
