// 홈 배선도 = 배선 데이터 (2026-11-18 사용자 결정)
import { describe, expect, it } from 'vitest';
import { chainFor, shownCur, wiresFor } from './ovwires';

const doc = (cur: Record<string, string | null>, ap?: boolean) => ({ cur, at: '', t: 1, ap });

describe('홈 배선도', () => {
  it('바뀐 연결은 새 단자까지, 뽑힌 케이블은 ✕로', () => {
    const { cur, changed } = shownCur(doc({ c5: 'dx11l', c1: null }));
    expect(changed).toBe(2);
    const { wires, cut } = wiresFor(cur);
    const w5 = wires.find((w) => w.id === 'c5')!;
    expect(w5.changed).toBe(true);
    expect(w5.d.endsWith('H208.9 V436.8')).toBe(true);
    expect(wires.some((w) => w.id === 'c1')).toBe(false);
    expect(cut.map((t) => t.key)).toEqual(['Gl']);
  });
  it('반영 안 함이면 원래 연결로 그린다', () => {
    const { cur, changed, ap } = shownCur(doc({ c5: 'dx11l' }, false));
    expect(ap).toBe(false);
    expect(changed).toBe(1);
    expect(wiresFor(cur).wires.every((w) => !w.changed)).toBe(true);
  });
  it('멀리 옮긴 케이블은 장비 사이 통로(x≈202)로 돈다', () => {
    const { cur } = shownCur(doc({ c8: 'dxm2' }));
    const d = wiresFor(cur).wires.find((w) => w.id === 'c8')!.d;
    expect(d).toMatch(/H(202|199\.5|197|194\.5) /);
  });
  it('신호 흐름은 DI BOX·매립형 패널을 거쳐 바뀐 연결을 따라간다', () => {
    expect(chainFor('Bs', shownCur(doc({})).cur, '베이스')).toBeNull();
    const a = chainFor('Bs', shownCur(doc({ c6: 'agx2', c7: null })).cur, '베이스')!;
    expect(a.steps.map((s) => s[0])).toEqual(['베이스', 'DI BOX CH1', 'AG06 CH2 XLR', 'AG06 STEREO OUT', 'DFX-12 CH9/10 L(MONO)']);
    const b = chainFor('M1', shownCur(doc({ c3: null })).cur, '기도석')!;
    expect(b.cut).toBe(true);
    expect(b.steps.map((s) => s[0])).toEqual(['기도석', '매립형 패널 1', '뽑혀 있음']);
  });
});
