// 값(0~1) ↔ 각도·높이·ON/OFF·시계·눈금·dB. 시안의 공식 그대로 (보정 전 대략값).
export const knobAngle = (v: number) => -135 + 270 * v;
export const faderY = (ya: number, yb: number, v: number) => ya + yb * v;
export const isOn = (v: number) => v === 1;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** 노브 값 → "12시", "2시 30분" */
export function clock(v: number): string {
  const h = (12 + knobAngle(v) / 30) % 12;
  const hh = Math.floor(h) || 12;
  const mm = Math.round((h - Math.floor(h)) * 60);
  if (mm === 60) return ((hh % 12) + 1) + '시';
  return hh + '시' + (mm ? ' ' + mm + '분' : '');
}
