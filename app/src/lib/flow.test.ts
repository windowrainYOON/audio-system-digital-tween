import { describe, expect, it } from 'vitest';
import { PROFILES } from '../data';
import { flowFor } from './flow';

describe('flowFor', () => {
  it('DFX CH1 GAIN은 CH1 입력에서 MAIN OUT까지 이어진다', () => {
    const f = flowFor(PROFILES.dfx12, 'g0')!;
    expect(f.text).toContain('MAIN OUT');
    expect(f.d).toBe('M103 68 V700');
    expect(f.dots.length).toBeGreaterThan(5);
  });
  it('모든 컨트롤이 그림 안 좌표를 갖는다', () => {
    for (const p of Object.values(PROFILES)) {
      const [x, y, w, h] = p.viewBox;
      for (const c of p.controls) {
        const cx = c.type === 'fader' ? c.handle.x : c.x;
        const cy = c.type === 'fader' ? c.ya : c.y;
        expect(cx, p.id + ' ' + c.id).toBeGreaterThanOrEqual(x);
        expect(cx).toBeLessThanOrEqual(x + w);
        expect(cy).toBeGreaterThanOrEqual(y);
        expect(cy).toBeLessThanOrEqual(y + h);
      }
    }
  });
});
