// M5 배선·케이블 편집 (시안 MobWiring / 태블릿 TabWiringP·L).
// 케이블·단자 목록, 짝 선 추천, 어댑터 안내, 자리 교체 규칙은 시안 코드(data/logic/wiring.js)를 그대로 실행해서 얻는다.
// 저장만 앱 저장소로 바꾼다: 시트 키 `wiring` = { cur, at, t } (즉시 저장 + 다른 기기와 공유).
import { useEffect, useMemo, useReducer, useState } from 'react';
import { create } from '../data/logic/wiring';
import { TabBar } from '../components/TabBar';
import { setWiring, useStore } from '../store/store';

const CHECK = <path d="M5 12.5l4.5 4.5L19 7" />;
const Chevron = () => (
  <svg width="12" height="16" viewBox="0 0 12 16" fill="none" stroke="#7a7a7a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 2l6 6-6 6" /></svg>
);

function useWiringLogic() {
  const [, bump] = useReducer((n: number) => n + 1, 0);
  const doc = useStore((s) => s.wiring);
  const c = useMemo(() => {
    const x = create();
    x.setState = (o: object) => { Object.assign(x.state, o); bump(); };
    // 시안의 localStorage 저장 대신 공유 저장소에 즉시 저장
    x.persist = (cur: Record<string, string>) => {
      const d = new Date();
      const at = [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':');
      setWiring(cur, at);
      return at;
    };
    return x;
  }, []);
  // 다른 기기에서 바뀐 배선 받기 (내가 막 저장한 것과 같으면 그대로)
  useEffect(() => {
    if (!doc || doc.cur === c.state.cur) return;
    const ok: Record<string, string> = { ...c.state.cur };
    const jacks = new Set(c.jacks.map((j: { id: string }) => j.id));
    for (const k of Object.keys(doc.cur)) if (ok[k] !== undefined && jacks.has(doc.cur[k])) ok[k] = doc.cur[k];
    Object.assign(c.state, { cur: ok, savedAt: doc.at || c.state.savedAt });
    bump();
  }, [doc, c]);
  return c;
}

export function Wiring() {
  const c = useWiringLogic();
  const v = c.renderVals();
  const [note, setNote] = useState('');
  const soon = (what: string) => { setNote(what + '는 다음 단계에서 만들어요. 지금은 케이블을 눌러 단자를 바꿀 수 있어요.'); };
  useEffect(() => {
    if (!v.open && !v.jopen) return;
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') (v.open ? v.close : v.jclose)(); };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [v.open, v.jopen]);

  return (
    <div className="wiring">
      <header className="w-head">
        <h1>배선</h1>
        <button className="w-add" aria-label="케이블 추가" onClick={() => soon('케이블 추가')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        </button>
      </header>
      <div className="w-save">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{CHECK}</svg>
        <span role="status">{v.savedText}</span>
        {v.canUndo && <button className="w-undo" onClick={v.undo}>실행취소</button>}
      </div>
      <div className="w-seg" role="tablist" aria-label="보기">
        <button role="tab" aria-selected={v.tabCable} onClick={v.goCable}>케이블별</button>
        <button role="tab" aria-selected={v.tabJack} onClick={v.goJack}>단자별 소스</button>
      </div>
      {v.hasChanges && (
        <div className="w-warn" role="status">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18v.5" /></svg>
          <div><strong>{v.changeCount}개 케이블이 바뀌었어요.</strong> 실물 케이블도 같은 단자로 옮겨 주세요.</div>
        </div>
      )}
      {note && (
        <div className="w-note" role="status"><span>{note}</span><button onClick={() => setNote('')} aria-label="안내 닫기">닫기</button></div>
      )}

      <main className="w-main">
        {v.tabJack && (
          <>
            <p className="w-intro">어느 단자에 어떤 소스가 들어오는지 보여요. 단자를 누르면 소스를 바꾸고, 추천 배선을 안내해요.</p>
            <div className="w-cols">
              {v.jgroups.map((g: any) => (
                <section key={g.title} className="w-group" aria-label={g.title}>
                  <h2>{g.title}</h2>
                  <div className="w-rows">
                    {g.rows.map((r: any) => (
                      <button key={r.name} className="w-row jack" onClick={r.pick}>
                        <span className="w-txt"><span>{r.name}</span><span className="sub" style={{ color: r.srcColor }}>{r.src}</span></span>
                        <Chevron />
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
        {v.tabCable && (
          <div className="w-cols">
            {v.groups.map((g: any) => (
              <section key={g.title} className="w-group" aria-label={g.title}>
                <h2>{g.title}</h2>
                <div className="w-rows">
                  {g.rows.map((r: any) => (
                    <button key={r.from} className="w-row cable" onClick={r.pick}>
                      <span className="w-dot" style={{ background: r.dot }} aria-hidden="true" />
                      <span className="w-txt">
                        <span className="from">{r.from}</span>
                        <span className="to">→ {r.to}</span>
                        <span className="spec">{r.spec}</span>
                      </span>
                      <span className="w-chip" style={{ background: r.chipBg }}>{r.chip}</span>
                      <Chevron />
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <TabBar current="wiring" />

      {v.open && (
        <Sheet label="케이블 편집" title="케이블 편집" onClose={v.close}>
          <div className="w-card">
            <svg viewBox="0 0 326 120" width="100%" role="img" aria-label={v.dia.alt} style={{ display: 'block' }}>
              <rect x="2" y="30" width="118" height="60" rx="14" fill="#f5f5f7" stroke="#8e8e93" strokeWidth="1.5" />
              <text x="61" y="56" fontSize="13" fontWeight="600" textAnchor="middle" fill="#1d1d1f">{v.dia.fromDev}</text>
              <text x="61" y="74" fontSize="12" textAnchor="middle" fill="#1d1d1fcc">{v.dia.fromJack}</text>
              <path d="M120 60 H206" stroke={v.dia.color} strokeWidth="5" strokeLinecap="round" />
              <text x="163" y="48" fontSize="12" textAnchor="middle" fill="#1d1d1f">{v.dia.type}</text>
              <rect x="206" y="30" width="118" height="60" rx="14" fill={v.dia.toFill} stroke={v.dia.toStroke} strokeWidth="2" />
              <text x="265" y="56" fontSize="13" fontWeight="600" textAnchor="middle" fill="#1d1d1f">{v.dia.toDev}</text>
              <text x="265" y="74" fontSize="12" textAnchor="middle" fill="#1d1d1fcc">{v.dia.toJack}</text>
            </svg>
            {v.dia.changed && <div className="w-was">이전: {v.dia.was}</div>}
          </div>

          <div className="w-card ends">
            <div className="w-cap">케이블 양끝 구성</div>
            {v.ends.map((e: any, i: number) => (
              <div key={i} className="w-end">
                <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true" style={{ flex: 'none' }}>
                  {e.pins.map((p: any, k: number) => <circle key={k} cx={p.cx} cy={p.cy} r={p.r} fill={p.fill} stroke={p.stroke} strokeWidth={p.sw} />)}
                </svg>
                <div className="w-txt">
                  <div className="cap">{e.where}</div>
                  <div className="conn">{e.conn}</div>
                  <div className="sig">{e.sig}</div>
                  <div className="cap">{e.jack}</div>
                </div>
                <span className="w-g" style={{ background: e.gBg }}>{e.g}</span>
              </div>
            ))}
            <div className="w-cap2">숫놈 = 핀·플러그가 튀어나온 쪽, 암놈 = 구멍이 있는 쪽</div>
            {v.dia.note && <div className="w-hint">{v.dia.note}</div>}
          </div>

          {v.rec.show && (
            <div className="w-rec">
              <div className="t">추천 배선</div>
              <div className="d">{v.rec.text}</div>
              <button onClick={v.rec.go}>추천대로 함께 옮기기</button>
            </div>
          )}

          <div>
            <div className="w-group-h">연결할 단자 ({v.dia.type} 입력)</div>
            {v.opts.map((o: any) => (
              <div key={o.dev} className="w-opt">
                <div className="dev">{o.dev}</div>
                {o.items.map((it: any) => (
                  <button key={it.name} className="w-row opt" onClick={it.pick} aria-disabled={it.dis || undefined}
                    aria-pressed={it.ck === 1} style={{ opacity: it.op }}>
                    <span className="w-txt"><span>{it.name}</span><span className="sub13">{it.sub}</span></span>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: it.ck }}>{CHECK}</svg>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {v.dia.warn && <div className="w-warnbox">{v.dia.warnText}</div>}

          <button className="w-revert" onClick={v.revert}>원래 연결로 되돌리기</button>
          <button className="w-del" onClick={() => { v.close(); soon('케이블 삭제'); }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d70015" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" /></svg>
            케이블 삭제…
          </button>
        </Sheet>
      )}

      {v.jopen && (
        <Sheet label="단자 소스 변경" title={v.jt.title} onClose={v.jclose}>
          <div className="w-card">
            <div className="w-cap">지금 들어오는 소스</div>
            <div className="w-now">{v.jt.now}</div>
            <div className="w-kind">{v.jt.kind}</div>
          </div>
          <div>
            <div className="w-group-h">이 단자에 연결할 소스</div>
            <div className="w-rows">
              {v.jopts.map((q: any) => (
                <button key={q.name} className="w-row cable" onClick={q.pick} aria-pressed={q.ck === 1}
                  aria-disabled={q.op < 1 || undefined} style={{ opacity: q.op }}>
                  <span className="w-txt"><span>{q.name}</span><span className="sub13">{q.sub}</span></span>
                  {q.tag === 1 && <span className="w-rectag">추천</span>}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: q.ck }}>{CHECK}</svg>
                </button>
              ))}
            </div>
          </div>
          {v.jt.hasInfo && <div className="w-warnbox">{v.jt.info}</div>}
        </Sheet>
      )}
    </div>
  );
}

function Sheet({ label, title, onClose, children }: { label: string; title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      <div className="w-dim" onClick={onClose} aria-hidden="true" />
      <section className="w-sheet" role="dialog" aria-modal="true" aria-label={label}>
        <div className="w-sheet-top">
          <div className="grab" aria-hidden="true" />
          <div className="bar">
            <span className="auto">자동 저장</span>
            <h2>{title}</h2>
            <button className="done" onClick={onClose} autoFocus>완료</button>
          </div>
        </div>
        <div className="w-sheet-body">{children}</div>
      </section>
    </>
  );
}
