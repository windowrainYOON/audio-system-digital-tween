// M6 운영 (시안 Mobile.dc.html): 시스템 시작하기 · 끝내기 · 소스별 소리 조정.
// 단계·문구·노브 그림 값은 시안 코드(data/logic/operator.js)를 그대로 실행한다. 소스 선택은 드롭다운(UI_GUIDE 2.4).
import { create } from '../data/logic/operator';
import { useDesignLogic } from '../lib/dc';
import { BottomSheet, Dropdown, PageHeader, type DDItem } from '../components/Common';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function Operator() {
  const { c, v } = useDesignLogic(create);
  const items: DDItem[] = v.srcItems.map((it: any, i: number) => (it.head
    ? { key: 'h' + i, label: it.label, head: true }
    : { key: String(v.srcItems.slice(0, i).filter((x: any) => !x.head).length), label: it.label, sub: it.where, done: it.done }));

  return (
    <>
      <PageHeader title="운영">
        <div className="chips" role="group" aria-label="운영 보기 선택">
          {v.gchips.map((g: any) => <button key={g.label} className={'chip' + (g.on === 'true' ? ' primary' : '')} aria-pressed={g.on === 'true'} onClick={g.go}>{g.label}</button>)}
        </div>
        {v.isSrc && (
          <Dropdown ariaLabel="소스 고르기" white value={<><span className="dd-sub">소스 </span>{v.srcName}</>} sub={v.srcPos}
            items={items} current={String(c.state.src)} onPick={(k) => c.setState({ src: Number(k) })} />
        )}
        <div className="op-prog"><div className="bar"><i style={{ width: v.pct }} /></div><span>{v.progress}</span></div>
      </PageHeader>

      <main className="main op-main">
        {v.hasDone && (
          <div className="op-list">
            {v.done.map((d: any) => (
              <button key={d.t} className="op-done" onClick={d.go}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M7.5 12.5l3 3 6-6.5" /></svg>
                <span>{d.t}</span><small>완료</small>
              </button>
            ))}
          </div>
        )}

        {v.hasNow && (
          <section className="op-now" aria-label="지금 할 일">
            <div className="k">지금 할 일 · {v.now.n}단계</div>
            <h2>{v.now.t}</h2>
            <p>{v.now.d}</p>
            {v.now.hasCtl && (
              <div className="op-ctl">
                {v.now.ctl.map((k: any) => (
                  <div key={k.name} className="cell">
                    {k.knob && <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="22" fill="#f5f5f7" stroke="#48484a" strokeWidth="1.5" /><line x1="32" y1="28" x2="32" y2="13" stroke="#1d1d1f" strokeWidth="4" strokeLinecap="round" transform={k.rot} /></svg>}
                    {k.fader && <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><rect x="28" y="4" width="8" height="56" rx="4" fill="#1d1d1f" /><rect x="14" y={k.fy} width="36" height="14" rx="4" fill="#f5f5f7" stroke="#48484a" strokeWidth="1.5" /></svg>}
                    {k.sw && <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="22" width="44" height="22" rx="11" fill={k.swc} /><text x="32" y="37.5" fontSize="12" fontWeight="700" textAnchor="middle" fill="#fff">{k.swt}</text></svg>}
                    <div className="n">{k.name}</div><div className="val">{k.val}</div>
                  </div>
                ))}
              </div>
            )}
            <button className="btn-primary big" onClick={v.doneNow}>했어요</button>
            <button className="btn-fill accent" onClick={v.help}>소리가 안 나요</button>
          </section>
        )}

        {v.allDone && (
          <div className="op-all"><b>모두 마쳤어요.</b> <span>{v.doneMsg}</span>
            <button onClick={v.restart}>처음부터 다시</button></div>
        )}

        {v.hasLeft && (
          <div className="op-list">
            {v.left.map((l: any) => <div key={l.t} className="op-left"><i aria-hidden="true" /><span>{l.t}</span></div>)}
          </div>
        )}
      </main>

      {v.helpOpen && (
        <BottomSheet label="소리가 안 날 때" title={'소리가 안 날 때 · ' + v.now.t} onClose={() => c.setState({ help: false })}>
          <div className="body">{v.tips.map((t: any) => <p key={t.t} className="txt">{t.t}</p>)}</div>
        </BottomSheet>
      )}
    </>
  );
}
