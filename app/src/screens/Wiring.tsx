// M5 배선·케이블 편집 (시안 MobWiring / 태블릿 TabWiringP·L).
// 케이블·단자 목록, 짝 선 추천, 어댑터 안내, 자리 교체 규칙은 시안 코드를 그대로 실행한다(lib/wiring.ts).
// 케이블 추가(+)·삭제는 2026-11-17 사용자 결정: 같은 단자 규칙으로 고르고, 삭제는 확인 후 실행취소 가능.
// 2026-11-17 화면 이동 정리: 칩 케이블별·소스별·단자별(믹서별 입력·출력), 어느 줄이든 탭하면 케이블 상자,
// 이미 꽂힌 단자도 골라 대체(확인 → 원래 케이블은 뽑힘 → 5초 실행취소 알림). 시트는 아래에서 올라오고 바깥 탭으로 내려간다.
import { useEffect, useState } from 'react';
import { PageHeader, useShut } from '../components/Common';
import { TYPE, useWiringLogic, type Cls } from '../lib/wiring';

const CHECK = <path d="M5 12.5l4.5 4.5L19 7" />;
const Chevron = () => (
  <svg width="12" height="16" viewBox="0 0 12 16" fill="none" stroke="#7a7a7a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 2l6 6-6 6" /></svg>
);

export function Wiring() {
  const { c, v } = useWiringLogic();
  const [adding, setAdding] = useState(false);
  const [askDel, setAskDel] = useState(false);
  const [note, setNote] = useState('');
  useEffect(() => {
    if (!v.open && !v.jopen && !adding) return;
    const f = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || adding) return; // 추가 시트는 스스로 닫는다
      if (v.askOpen) v.askNo(); else if (askDel) setAskDel(false); else (v.open ? v.close : v.jclose)();
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [v.open, v.jopen, v.askOpen, adding, askDel]);
  const anim = { sheet: v.sheetAnim as string, dim: v.dimAnim as string };
  const undoToast = () => { c.setState({ toast: '' }); v.undo(); };
  const selCable = v.open ? c.cables.find((x: { id: string }) => x.id === c.state.sel) : null;

  return (
    <div className="wiring">
      <PageHeader title="배선">
        <div className="chips" role="group" aria-label="보기">
          {v.vchips.map((k: any) => <button key={k.label} className={'chip' + (k.on === 'true' ? ' primary' : '')} aria-pressed={k.on === 'true'} onClick={k.go}>{k.label}</button>)}
          <button className="w-add" aria-label="케이블 추가" onClick={() => { setNote(''); setAdding(true); }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          </button>
        </div>
      </PageHeader>
      <div className="w-save">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{CHECK}</svg>
        <span role="status">{v.savedText}</span>
        {v.canUndo && <button className="w-undo" onClick={v.undo}>실행취소</button>}
      </div>
      {v.hasChanges && (
        <div className="w-warn" role="status">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18v.5" /></svg>
          <div className="w-warn-body">
            <div className="w-warn-top">
              <div><strong>{v.changeCount}개 케이블이 바뀌었어요.</strong> 실물 케이블도 같은 단자로 옮겨 주세요.</div>
              {/* 2026-11-18 사용자 결정: 확인하면 이 알림을 지운다(새로 바꾸면 다시 뜸) */}
              <button className="w-ack" onClick={v.ackNow} aria-label="알림 확인">확인</button>
            </div>
            {/* 2026-11-18 사용자 결정: 홈 배선도에 반영할지 여기서 고른다 (UI_GUIDE M5) */}
            <div className="w-ap" role="group" aria-label="홈 배선도에 반영">
              <span>홈 배선도에 반영</span>
              <div className="seg">
                <button aria-pressed={v.apOnP === 'true'} onClick={v.apOn}>반영</button>
                <button aria-pressed={v.apOffP === 'true'} onClick={v.apOff}>반영 안 함</button>
              </div>
            </div>
            <div className="w-ap-t">{v.apText}</div>
          </div>
        </div>
      )}
      {note && (
        <div className="w-note" role="status"><span>{note}</span><button onClick={() => setNote('')} aria-label="안내 닫기">닫기</button></div>
      )}

      <main className="w-main">
        {v.tabJack && (
          <>
            <p className="w-intro">믹서마다 입력과 출력으로 모았어요. 줄을 누르면 꽂힌 케이블을 보여 주고, 빈 단자는 소스를 고를 수 있어요.</p>
            <div className="w-cols">
              {v.jgroups.map((g: any) => (
                <section key={g.title} className="w-group" aria-label={g.title}>
                  <h2>{g.title}</h2>
                  <div className="w-rows">
                    {g.rows.map((r: any) => (
                      <button key={r.name + r.src} className="w-row jack" onClick={r.pick}>
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
        {v.tabSrc && (
          <div className="w-cols">
            {v.sgroups.map((g: any) => (
              <section key={g.title} className="w-group" aria-label={g.title}>
                <h2>{g.title}</h2>
                <div className="w-rows">
                  {g.rows.map((r: any) => (
                    <button key={r.name} className="w-row cable" onClick={r.pick}>
                      <span className="w-dot" style={{ background: r.dot }} aria-hidden="true" />
                      <span className="w-txt">
                        <span className="from">{r.name}</span>
                        <span className="to" style={{ color: r.toColor }}>→ {r.to}</span>
                        <span className="spec">{r.chain}</span>
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

      {v.toastOpen && (
        <div className="w-toast" role="status"><span>{v.toast}</span><button onClick={undoToast}>실행취소</button></div>
      )}

      {v.open && (
        <Sheet label="케이블 편집" title="케이블 편집" onClose={v.close} anim={anim}>
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
            <div className="w-group-h">연결할 단자 (모든 입력 · {v.dia.type} 케이블)</div>
            {v.opts.map((o: any) => (
              <div key={o.dev} className="w-opt">
                <div className="dev">{o.dev}</div>
                {o.items.map((it: any) => (
                  <button key={it.name} className="w-row opt" onClick={it.pick}
                    aria-pressed={it.ck === 1} style={{ opacity: it.op }}>
                    <span className="w-txt"><span>{it.name}{it.diff && <span className="w-kind">{it.kind}</span>}</span><span className="sub13">{it.sub}</span></span>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: it.ck }}>{CHECK}</svg>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {v.dia.warn && <div className="w-warnbox">{v.dia.warnText}</div>}

          <button className="w-revert" onClick={v.revert}>원래 연결로 되돌리기</button>
          <button className="w-del" onClick={() => setAskDel(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d70015" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" /></svg>
            케이블 삭제…
          </button>
        </Sheet>
      )}

      {askDel && selCable && (
        <Confirm title="케이블을 삭제할까요?" text={`${selCable.from} → ${c.lab(c.state.cur[selCable.id])}. 실행취소로 되돌릴 수 있어요.`}
          ok="삭제" onCancel={() => setAskDel(false)}
          onOk={() => { const f = selCable.from; setAskDel(false); c.deleteCable(selCable.id); setNote(f + ' 케이블을 삭제했어요. 되돌리려면 실행취소를 누르세요.'); }} />
      )}

      {adding && <AddSheet c={c} onClose={() => setAdding(false)} onAdded={(f) => { setAdding(false); setNote(f + ' 케이블을 추가했어요.'); }} />}

      {v.jopen && (
        <Sheet label="단자 소스 변경" title={v.jt.title} onClose={v.jclose} anim={anim}>
          <div className="w-card">
            <div className="w-cap">지금 들어오는 소스</div>
            <div className="w-now">{v.jt.now}</div>
            <div className="w-kind">{v.jt.kind}</div>
          </div>
          <div>
            <div className="w-group-h">이 단자에 연결할 소스</div>
            <div className="w-rows">
              {v.jopts.map((q: any) => (
                <button key={q.name} className="w-row cable" onClick={q.pick} aria-pressed={q.ck === 1}>
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

      {v.askOpen && (
        <Confirm title={v.ask.title} text={v.ask.text} ok={v.ask.ok || '대체'} onCancel={v.askNo} onOk={v.askYes} />
      )}
    </div>
  );
}

/** 아래에서 올라오는 모달 시트. anim이 있으면 시안 로직의 애니메이션(closing 상태)을 그대로 쓴다. */
function Sheet({ label, title, onClose, children, left, right, anim }: { label: string; title: string; onClose: () => void; children: React.ReactNode; left?: string; right?: React.ReactNode; anim?: { sheet: string; dim: string } }) {
  return (
    <>
      <div className="w-dim" onClick={onClose} aria-hidden="true" style={anim ? { animation: anim.dim } : undefined} />
      <section className="w-sheet" role="dialog" aria-modal="true" aria-label={label} style={anim ? { animation: anim.sheet } : undefined}>
        <div className="w-sheet-top">
          <div className="grab" aria-hidden="true" />
          <div className="bar">
            {left ? <button className="cancel" onClick={onClose}>{left}</button> : <span className="auto">자동 저장</span>}
            <h2>{title}</h2>
            {right ?? <button className="done" onClick={onClose} autoFocus>완료</button>}
          </div>
        </div>
        <div className="w-sheet-body">{children}</div>
      </section>
    </>
  );
}

/** 삭제 확인 (브라우저 confirm 대신 화면 안 대화상자) */
function Confirm({ title, text, ok, onOk, onCancel }: { title: string; text: string; ok: string; onOk: () => void; onCancel: () => void }) {
  return (
    <>
      <div className="w-dim top" onClick={onCancel} aria-hidden="true" />
      <section className="w-alert" role="alertdialog" aria-modal="true" aria-labelledby="w-alert-t" aria-describedby="w-alert-d">
        <h2 id="w-alert-t">{title}</h2>
        <p id="w-alert-d">{text}</p>
        <div className="btns">
          <button onClick={onCancel} autoFocus>취소</button>
          <button className="danger" onClick={onOk}>{ok}</button>
        </div>
      </section>
    </>
  );
}

/** 케이블 추가: 종류 → 시작 쪽(장비·단자) → 도착 단자. 도착 후보는 편집 시트와 같은 규칙(같은 커넥터만, 꽂힌 단자는 확인 후 대체). */
function AddSheet({ c, onClose, onAdded }: { c: any; onClose: () => void; onAdded: (from: string) => void }) {
  const { closing, close } = useShut(onClose);
  const anim = { sheet: closing ? 'sheetDown .22s ease-in forwards' : 'sheetUp .28s cubic-bezier(.2,.8,.2,1)', dim: closing ? 'dimOut .22s ease-in forwards' : 'dimIn .2s ease-out' };
  const [ask, setAsk] = useState(false);
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (ask) setAsk(false); else close(); } };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [ask, close]);
  const [cls, setCls] = useState<Cls>('xlr');
  const [dev, setDev] = useState('');
  const [jack, setJack] = useState('');
  const [to, setTo] = useState('');
  const devs: string[] = Array.from(new Set<string>(c.cables.map((x: { fromDev: string }) => x.fromDev)));
  const groups: string[] = Array.from(new Set<string>(c.jacks.filter((j: any) => j.cls === cls).map((j: any) => j.dev)));
  const user = (id: string) => c.cables.find((x: any) => c.state.cur[x.id] === id);
  const from = (dev.trim() + (jack.trim() ? ' ' + jack.trim() : '')).trim();
  const ready = !!dev.trim() && !!to;
  const toJ = to ? c.jk(to) : null;
  const occ = to ? user(to) : null;
  const add = () => { c.addCable({ from, fromDev: dev.trim(), to, type: TYPE[cls], cls }); onAdded(from + (occ ? ' (' + occ.from + ' 뽑힘)' : '')); };
  return (
    <>
    <Sheet label="케이블 추가" title="케이블 추가" onClose={close} left="취소" anim={anim}
      right={<button className="done" disabled={!ready} onClick={() => (occ ? setAsk(true) : add())}>추가</button>}>
      <div className="w-card">
        <svg viewBox="0 0 326 120" width="100%" role="img" aria-label={(from || '시작 쪽') + '에서 ' + (toJ ? toJ.dev + ' ' + toJ.name : '도착 단자') + '로 연결'} style={{ display: 'block' }}>
          <rect x="2" y="30" width="118" height="60" rx="14" fill="#f5f5f7" stroke="#8e8e93" strokeWidth="1.5" strokeDasharray={dev.trim() ? undefined : '4 4'} />
          <text x="61" y="56" fontSize="13" fontWeight="600" textAnchor="middle" fill="#1d1d1f">{dev.trim() || '시작 장비'}</text>
          <text x="61" y="74" fontSize="12" textAnchor="middle" fill="#1d1d1fcc">{jack.trim() || '출력'}</text>
          <path d="M120 60 H206" stroke={{ xlr: '#1d1d1f', ts: '#6e6e73', rca: '#ff383c' }[cls]} strokeWidth="5" strokeLinecap="round" />
          <text x="163" y="48" fontSize="12" textAnchor="middle" fill="#1d1d1f">{TYPE[cls]}</text>
          <rect x="206" y="30" width="118" height="60" rx="14" fill={toJ ? '#0066cc1f' : '#f5f5f7'} stroke={toJ ? '#0066cc' : '#8e8e93'} strokeWidth="2" strokeDasharray={toJ ? undefined : '4 4'} />
          <text x="265" y="56" fontSize="13" fontWeight="600" textAnchor="middle" fill="#1d1d1f">{toJ ? toJ.dev.replace(/^(Mackie|Yamaha|MiCWL) /, '') : '도착 장비'}</text>
          <text x="265" y="74" fontSize="12" textAnchor="middle" fill="#1d1d1fcc">{toJ ? toJ.name : '입력 단자'}</text>
        </svg>
      </div>

      <div>
        <div className="w-group-h">케이블 종류</div>
        <div className="w-seg in" role="radiogroup" aria-label="케이블 종류">
          {(['xlr', 'ts', 'rca'] as Cls[]).map((k) => (
            <button key={k} role="radio" aria-checked={cls === k} aria-selected={cls === k} onClick={() => { setCls(k); setTo(''); }}>{TYPE[k]}</button>
          ))}
        </div>
      </div>

      <div>
        <div className="w-group-h">시작 쪽 (소스 장비·출력 단자)</div>
        <div className="w-card form">
          <label className="w-field"><span>장비</span>
            <input value={dev} onChange={(e) => setDev(e.target.value)} placeholder="예: 새 마이크" list="w-devs" autoComplete="off" />
          </label>
          <datalist id="w-devs">{devs.map((d) => <option key={d} value={d} />)}</datalist>
          <label className="w-field"><span>단자·설명</span>
            <input value={jack} onChange={(e) => setJack(e.target.value)} placeholder="예: 출력 L (선택)" autoComplete="off" />
          </label>
          <div className="w-quick" aria-label="자주 쓰는 장비">
            {devs.slice(0, 12).map((d) => <button key={d} aria-pressed={dev === d} onClick={() => setDev(d)}>{d}</button>)}
          </div>
        </div>
      </div>

      <div>
        <div className="w-group-h">도착 단자 ({TYPE[cls]} 입력)</div>
        {groups.map((g) => (
          <div key={g} className="w-opt">
            <div className="dev">{g}</div>
            {c.jacks.filter((j: any) => j.cls === cls && j.dev === g).map((j: any) => {
              const u = user(j.id);
              return (
                <button key={j.id} className="w-row opt" aria-pressed={to === j.id} onClick={() => setTo(j.id)}>
                  <span className="w-txt"><span>{j.name}</span><span className="sub13">{u ? '지금 꽂힘: ' + u.from + ' · 고르면 대체돼요' : '비어 있음'}</span></span>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: to === j.id ? 1 : 0 }}>{CHECK}</svg>
                </button>
              );
            })}
          </div>
        ))}
        {!groups.some((g) => c.jacks.some((j: any) => j.cls === cls && j.dev === g && !user(j.id))) && (
          <div className="w-warnbox">비어 있는 {TYPE[cls]} 입력이 없어요. 꽂힌 단자를 고르면 확인 후 그 케이블을 뽑고 대체해요.</div>
        )}
      </div>
    </Sheet>
    {ask && occ && toJ && (
      <Confirm title={toJ.name + '에 꽂을까요?'} text={'지금 꽂힌 ' + occ.from + '은(는) 뽑혀요. 실행취소로 되돌릴 수 있어요.'} ok="대체"
        onCancel={() => setAsk(false)} onOk={() => { setAsk(false); add(); }} />
    )}
    </>
  );
}
