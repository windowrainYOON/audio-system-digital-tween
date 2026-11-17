// 값(0~1) ↔ 각도·높이·ON/OFF·시계·눈금·dB. 시안의 공식 그대로 (보정 전 대략값).
import type { ControlDef } from '../data/types';

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

export interface Readout { hour: string; scale: string; db: string }

export function readout(d: ControlDef, v: number): Readout {
  if (d.type === 'button') return { hour: '-', scale: '-', db: isOn(v) ? 'ON' : 'OFF' };
  const scale = (v * 10).toFixed(1);
  const hour = d.type === 'knob' ? clock(v) : '-';
  let db: string;
  if (d.kind === 'gain') db = '약 ' + (v * 50).toFixed(0) + ' dB (마이크 입력 기준)';
  else if (d.kind === 'pan') db = Math.abs(v - 0.5) < 0.02 ? '가운데 (C)' : (v < 0.5 ? 'L ' : 'R ') + Math.round(Math.abs(v - 0.5) * 200) + '%';
  else if (d.kind === 'eq' || d.kind === 'tone') db = (v * 30 - 15 >= 0 ? '+' : '') + (v * 30 - 15).toFixed(1) + ' dB';
  else db = v < 0.03 ? '-∞ (꺼짐)' : scale + ' / 10';
  return { hour, scale, db };
}
