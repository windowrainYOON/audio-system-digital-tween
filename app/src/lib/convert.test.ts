import { describe, expect, it } from 'vitest';
import { clock, faderY, knobAngle } from './convert';

describe('convert', () => {
  it('노브 각도는 -135°~+135°', () => {
    expect(knobAngle(0)).toBe(-135);
    expect(knobAngle(0.5)).toBe(0);
    expect(knobAngle(1)).toBe(135);
  });
  it('시계 방향 표기', () => {
    expect(clock(0.5)).toBe('12시');
    expect(clock(0)).toBe('7시 30분');
    expect(clock(1)).toBe('4시 30분');
  });
  it('페이더 높이', () => {
    expect(faderY(686, -120, 0)).toBe(686);
    expect(faderY(686, -120, 1)).toBe(566);
  });
});
