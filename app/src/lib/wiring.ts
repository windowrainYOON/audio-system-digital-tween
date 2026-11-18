// M5 배선 로직: 시안 코드(data/logic/wiring.js)를 그대로 쓰고, 앱에서 세 가지를 더한다.
// 1) 저장: 시안의 localStorage 대신 공유 저장소 키 `wiring` (store.setWiring)
// 2) 케이블 추가·삭제 (2026-11-17 사용자 결정): 추가한 케이블은 added, 삭제한 기본 케이블은 removed 로 저장
// 3) 실행취소: 시안은 단자(cur)만 되돌리므로, 추가·삭제까지 함께 되돌리도록 기록을 스냅숏으로 바꾼다
import { useEffect, useMemo, useReducer } from 'react';
import { create } from '../data/logic/wiring';
import { setWiring, useStore, type AddedCable } from '../store/store';

export type Cls = 'xlr' | 'ts' | 'rca';
/** 케이블 id → 단자 id. null = 대체되어 뽑힌 케이블(2026-11-17) */
type Cur = Record<string, string | null>;
interface Snap { cur: Cur; added: AddedCable[]; removed: string[] }

const MONO = '모노 (언밸런스)';
const SPEC: Record<Cls, { conn: string; g: string; sig: string; note: string }[]> = {
  xlr: [{ conn: 'XLR', g: '암', sig: '밸런스 모노', note: '' }, { conn: 'XLR', g: '수', sig: '밸런스 모노', note: '' }],
  ts: [{ conn: '5.5mm TS', g: '수', sig: MONO, note: '' }, { conn: '5.5mm TS', g: '수', sig: MONO, note: '' }],
  rca: [{ conn: 'RCA', g: '수', sig: MONO, note: '' }, { conn: 'RCA', g: '수', sig: MONO, note: '' }],
};
export const TYPE: Record<Cls, string> = { xlr: 'XLR', ts: '5.5 TS', rca: 'RCA' };
export const ADDED_GROUP = '추가한 케이블';

const stamp = () => {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':');
};

export function useWiringLogic() {
  const [, bump] = useReducer((n: number) => n + 1, 0);
  const doc = useStore((s) => s.wiring);
  const c = useMemo(() => {
    const x = create();
    x.base = x.cables.slice();
    x.added = [] as AddedCable[];
    x.removed = [] as string[];
    x.rebuild = () => {
      x.cables = x.base.filter((b: { id: string }) => !x.removed.includes(b.id)).concat(x.added);
      for (const a of x.added) x.spec[a.id] = SPEC[a.cls as Cls];
    };
    x.snap = (): Snap => ({ cur: x.state.cur, added: x.added, removed: x.removed });
    x.save = () => { const at = stamp(); setWiring(x.state.cur, at, x.added, x.removed); return at; };
    x.setState = (o: object) => { Object.assign(x.state, o); bump(); };
    x.persist = (cur: Cur) => { x.state.cur = cur; return x.save(); };
    // 시안 commit과 같지만 기록에 추가·삭제까지 담는다
    x.commit = (next: Cur, extra?: object) => {
      const hist = x.state.hist.concat([x.snap()]).slice(-20);
      x.state.cur = next;
      const at = x.save();
      x.setState({ cur: next, hist, savedAt: at, ...(extra || {}) });
    };
    x.undoSnap = () => {
      const h = x.state.hist.slice();
      const prev: Snap = h.pop();
      x.added = prev.added; x.removed = prev.removed; x.rebuild();
      x.state.cur = prev.cur;
      const sel = x.state.sel && x.cables.some((k: { id: string }) => k.id === x.state.sel) ? x.state.sel : null;
      const at = x.save();
      x.setState({ cur: prev.cur, hist: h, savedAt: at, sel, draft: sel ? prev.cur[sel] : null });
    };
    x.addCable = (a: Omit<AddedCable, 'id' | 'orig' | 'grp' | 'note'>) => {
      const id = 'u' + Date.now().toString(36);
      const hist = x.state.hist.concat([x.snap()]).slice(-20);
      x.added = x.added.concat([{ ...a, id, grp: ADDED_GROUP, orig: a.to, note: '' }]);
      x.rebuild();
      const cur: Cur = { ...x.state.cur, [id]: a.to };
      // 꽂힌 단자를 고르면 원래 케이블은 뽑힌다(대체, 2026-11-17 사용자 결정)
      for (const k of x.cables) if (k.id !== id && cur[k.id] === a.to) cur[k.id] = null;
      x.state.cur = cur;
      const at = x.save();
      x.setState({ cur, hist, savedAt: at });
    };
    x.deleteCable = (id: string) => {
      const hist = x.state.hist.concat([x.snap()]).slice(-20);
      if (x.added.some((a: AddedCable) => a.id === id)) x.added = x.added.filter((a: AddedCable) => a.id !== id);
      else x.removed = x.removed.concat([id]);
      x.rebuild();
      const cur = { ...x.state.cur };
      delete cur[id];
      x.state.cur = cur;
      const at = x.save();
      x.setState({ cur, hist, savedAt: at, sel: null, draft: null });
    };
    return x;
  }, []);

  // 저장된(또는 다른 기기에서 바뀐) 배선 받기. 내가 막 저장한 것과 같으면 그대로.
  useEffect(() => {
    if (!doc || doc.cur === c.state.cur) return;
    c.added = (doc.added || []).filter((a) => a && a.id && (['xlr', 'ts', 'rca'] as string[]).includes(a.cls));
    c.removed = (doc.removed || []).filter((id) => c.base.some((b: { id: string }) => b.id === id));
    c.rebuild();
    const jacks = new Set(c.jacks.map((j: { id: string }) => j.id));
    const cur: Cur = {};
    for (const k of c.cables) {
      const j = doc.cur[k.id];
      cur[k.id] = j === null ? null : j && jacks.has(j) ? j : k.orig; // null(뽑힘)은 그대로 둔다
    }
    const sel = c.state.sel && cur[c.state.sel] ? c.state.sel : null;
    Object.assign(c.state, { cur, sel, savedAt: doc.at || c.state.savedAt });
    bump();
  }, [doc, c]);

  const v = c.renderVals();
  const extra = c.added.length + c.removed.length;
  return {
    c,
    v: { ...v, undo: c.undoSnap, changeCount: v.changeCount + extra, hasChanges: v.changeCount + extra > 0 },
  };
}
