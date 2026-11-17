import { describe, expect, it } from 'vitest';
import { inspect } from './inspect';
import { PROFILES } from '../data';
import type { BoardState } from '../data/types';

const st = (vals: Record<string, number> = {}): BoardState => ({ vals, synced: {}, t: 0 });

describe('inspect (시안 로직)', () => {
  it('DFX CH1 GAIN 문구', () => {
    const r = inspect('dfx12', 'g0', st({ g0: 0.3 }));
    expect(r.scale).toBe('3.0');
    expect(r.desc).toContain('입력 감도');
    expect(r.eff.length).toBeGreaterThan(10);
    expect(r.flowText).toContain('구즈넥 L');
  });
  it('모든 컨트롤에 이름과 설명이 있다', () => {
    for (const p of Object.values(PROFILES)) for (const c of p.controls) {
      const r = inspect(p.id, c.id, st());
      expect(r.desc, p.id + ' ' + c.id).not.toBe('');
    }
  });
});
