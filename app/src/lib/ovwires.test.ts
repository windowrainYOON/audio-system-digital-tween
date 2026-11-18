// 홈 배선도 = 배선 데이터, 상자 다시 배열, 확인 안 한 변경은 노란 선 (2026-11-18 사용자 결정)
import { describe, expect, it } from 'vitest';
import { changesOf, chainFor, layoutFor, shownCur, sigOf } from './ovwires';
import type { WiringDoc } from '../store/store';

const doc = (cur: Record<string, string | null>, more: Partial<WiringDoc> = {}): WiringDoc => ({ cur, at: '', t: 1, ...more });
const lay = (d: WiringDoc) => { const s = shownCur(d); return layoutFor(s.cur, s.base); };

/** 가로·세로 선분으로 나눠, 서로 다른 두 선이 같은 줄 위에서 겹치는지 */
function overlaps(ds: string[]) {
  const segs = ds.map((d) => {
    const out: [number, number, number, number][] = [];
    let x = 0, y = 0;
    for (const m of d.matchAll(/([MHV])(-?[\d.]+)(?: (-?[\d.]+))?/g)) {
      const [nx, ny] = m[1] === 'M' ? [+m[2], +m[3]] : m[1] === 'H' ? [+m[2], y] : [x, +m[2]];
      if (m[1] !== 'M') out.push([x, y, nx, ny]);
      x = nx; y = ny;
    }
    return out;
  });
  let n = 0;
  for (let i = 0; i < segs.length; i++) for (let j = i + 1; j < segs.length; j++)
    for (const a of segs[i]) for (const b of segs[j]) {
      const ah = a[1] === a[3], bh = b[1] === b[3];
      if (ah && bh && Math.abs(a[1] - b[1]) < 0.3 && Math.min(Math.max(a[0], a[2]), Math.max(b[0], b[2])) - Math.max(Math.min(a[0], a[2]), Math.min(b[0], b[2])) > 0.5) n++;
      if (!ah && !bh && Math.abs(a[0] - b[0]) < 0.3 && Math.min(Math.max(a[1], a[3]), Math.max(b[1], b[3])) - Math.max(Math.min(a[1], a[3]), Math.min(b[1], b[3])) > 0.5) n++;
    }
  return n;
}

describe('홈 배선도', () => {
  it('바뀐 연결은 새 단자까지, 뽑힌 케이블은 ✕로, 확인 전이면 노란 선', () => {
    const { changed } = shownCur(doc({ c5: 'dx11l', c1: null }));
    expect(changed).toBe(2);
    const { wires, cut } = lay(doc({ c5: 'dx11l', c1: null }));
    const w5 = wires.find((w) => w.id === 'c5')!;
    expect(w5.ch).toBe(true);
    expect(w5.d.endsWith('V436.8')).toBe(true);
    expect(wires.some((w) => w.id === 'c1')).toBe(false);
    expect(cut.map((t) => t.key)).toEqual(['Gl']);
  });
  it('반영 안 함이면 원래 연결로 그린다', () => {
    const { cur, base, changed, ap } = shownCur(doc({ c5: 'dx11l' }, { ap: false }));
    expect(ap).toBe(false);
    expect(changed).toBe(1);
    expect(layoutFor(cur, base).wires.every((w) => !w.ch)).toBe(true);
  });
  it('확인하면 노란 선이 사라지고, 그 뒤 새 변경만 노랗게', () => {
    const d = doc({ c6: 'agx2', c7: 'agx1' });
    const acked = { ...d, ack: sigOf(d), ackCur: { ...d.cur } };
    expect(lay(acked).wires.some((w) => w.ch)).toBe(false);
    const next = { ...acked, cur: { ...acked.cur, c5: 'dx11l' } };
    expect(lay(next).wires.filter((w) => w.ch).map((w) => w.id)).toEqual(['c5']);
  });
  it('상자는 꽂힌 단자 위로 옮기고, 같은 구역 선은 서로 겹치지 않는다', () => {
    const base = lay(doc({}));
    const moved = lay(doc({ c23: 'wmi3', c24: 'wmi1' }));
    expect(moved.boxes.M1.x).toBeGreaterThan(base.boxes.M1.x);
    expect(moved.boxes.M2.x).toBeLessThan(moved.boxes.M1.x);
    for (const cur of [{}, { c23: 'wmi3', c24: 'wmi1' }, { c6: 'agx2', c7: 'agx1', c8: 'ag5l', c10: 'ag3l' }, { c13: 'l4tl', c15: 'l4c1' }] as Record<string, string | null>[]) {
      expect(overlaps(lay(doc(cur)).wires.map((w) => w.d))).toBe(0);
    }
  });
  it('멀리 옮긴 케이블은 장비 사이 통로(x≈202)로 돈다', () => {
    const d = lay(doc({ c8: 'dxm2' })).wires.find((w) => w.id === 'c8')!.d;
    expect(d).toMatch(/H(202|199\.5|197|194\.5) /);
  });
  it('점검 탭 변경 목록: 원래 단자 → 지금 단자, 확인하면 비어요', () => {
    const d = doc({ c6: 'agx2' });
    expect(changesOf(d)).toEqual([{ id: 'c6', name: 'DI BOX CH1 출력 (베이스)', from: 'Yamaha AG06 CH1 XLR', to: 'Yamaha AG06 CH2 XLR' }]);
    expect(changesOf({ ...d, ack: sigOf(d), ackCur: { ...d.cur } })).toEqual([]);
  });
  it('신호 흐름은 DI BOX·매립형 패널을 거쳐 바뀐 연결을 따라간다', () => {
    expect(chainFor('Bs', shownCur(doc({})).cur, '베이스')).toBeNull();
    const a = chainFor('Bs', shownCur(doc({ c6: 'agx2', c7: null })).cur, '베이스')!;
    expect(a.steps.map((s) => s[0])).toEqual(['베이스', 'DI BOX CH1', 'AG06 CH2 XLR', 'AG06 STEREO OUT', 'DFX-12 CH9/10 L(MONO)']);
    const b = chainFor('M1', shownCur(doc({ c3: null })).cur, '기도석')!;
    expect(b.cut).toBe(true);
    expect(b.steps.map((s) => s[0])).toEqual(['기도석', '매립형 패널 CH1', '뽑혀 있음']);
  });
});
