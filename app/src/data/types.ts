// 장비 프로필 타입. 값은 tools/extract-profiles.cjs 가 시안에서 뽑아 JSON으로 만든다.
export type BoardId = 'ag06' | 'dfx12' | 'l4';

export interface KnobDef {
  id: string; type: 'knob'; name: string; kind: string; def: number;
  x: number; y: number; r: number; rr: number; cap: string; ptr: string; l1: number; l2: number; stroke: string;
}
export interface FaderDef {
  id: string; type: 'fader'; name: string; kind: string; def: number;
  track: { x: number; y: number; w: number; h: number };
  handle: { x: number; w: number; h: number; rx: number; fill: string; sw: number };
  ya: number; yb: number; ring: string;
}
export interface ButtonDef {
  id: string; type: 'button'; name: string; kind: string; def: number;
  x: number; y: number; w: number; h: number; cx: number; ty: number; fs: number; on: string; rx: number;
}
export type ControlDef = KnobDef | FaderDef | ButtonDef;

export interface Flow { ids: string[]; txt: string }

export interface Profile {
  id: BoardId; title: string; source: string;
  viewBox: [number, number, number, number];
  controls: ControlDef[];
  flows: Flow[];
  art: string;
  phantom?: {
    lamp: { cx: number; cy: number; r: number; on: string; off: string };
    knob: { y: number; w: number; h: number; xOn: number; xOff: number };
  };
}

/** 보드 하나의 공유 상태. 시안의 mixsync:{ag|dfx|l4} 와 같은 모양. */
export interface BoardState {
  vals: Record<string, number>;
  synced: Record<string, boolean>;
  phantom?: boolean;
  t: number;
}
