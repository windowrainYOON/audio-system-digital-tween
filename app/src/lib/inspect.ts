// 시안 컴포넌트 로직(data/logic/*.js, 자동 생성)을 실행해 인스펙터 문구를 시안과 똑같이 얻는다.
import { create as ag06 } from '../data/logic/ag06';
import { create as dfx12 } from '../data/logic/dfx12';
import { create as l4 } from '../data/logic/l4';
import type { BoardId, BoardState } from '../data/types';

const FACTORY = { ag06, dfx12, l4 } as const;
const inst: Partial<Record<BoardId, any>> = {};

export interface Inspect {
  name: string; hour: string; scale: string; db: string;
  isKnob: boolean; isFad: boolean; isBtn: boolean;
  desc: string; src: string; eff: string; flowText: string;
}

export function inspect(b: BoardId, sel: string, st: BoardState): Inspect {
  const c = (inst[b] ??= FACTORY[b]());
  c.state = { ...c.state, sel, vals: { ...c.state.vals, ...st.vals }, synced: { ...st.synced }, phantom: !!st.phantom, more: true, power: st.power !== false };
  const v = c.renderVals();
  const s = v.sel || {};
  const i = v.selInfo || {};
  return {
    name: s.name || i.title || sel, hour: s.hour || '-', scale: s.scale || '-', db: s.db || '',
    isKnob: !!s.isKnob, isFad: !!s.isFad, isBtn: !!s.isBtn,
    desc: i.desc || '', src: i.src || '', eff: i.eff || '', flowText: v.hasFlow ? v.flowText || '' : '',
  };
}
