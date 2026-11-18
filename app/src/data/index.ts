import ag06 from './profiles/ag06.json';
import dfx12 from './profiles/dfx12.json';
import l4 from './profiles/l4.json';
import overviewJson from './overview.json';
import type { BoardId, Profile } from './types';

export const PROFILES: Record<BoardId, Profile> = {
  ag06: ag06 as unknown as Profile,
  dfx12: dfx12 as unknown as Profile,
  l4: l4 as unknown as Profile,
};
export const BOARD_IDS: BoardId[] = ['dfx12', 'ag06', 'l4'];

export type Step = [string, string];
export interface DeviceInfo { title: string; badge: string; bg: string; l1: string; l2: string; l3: string; go: string }
export interface SourceInfo { title: string; badge: string; bg: string; steps: Step[]; l1: string; l2: string; go: string; dev: string }
export interface Overview {
  width: number; height: number; top: number;
  /** 단자 id → [x, y, 들어가는 통로 y] (그림 좌표) */
  jacks: Record<string, [number, number, number]>;
  /** 케이블별 원래 경로·시작점 (시안 MobOverview WR) */
  wires: { id: string; key: string; color: string; dash: string; sx: number; sy: number; d: string; orig: string }[];
  boards: { key: string; board: BoardId; x: number; y: number; scale: number; crop: [number, number, number, number] }[];
  cables: { key: string; d: string; color: string; dash: string; label: string; lx?: number; ly?: number }[];
  boxes: { src?: boolean; key: string; x: number; y: number; w: number; h: number; title: string; sub: string; sub2: string; fill: string; stroke: string }[];
  badges: { x: number; y: number; level: 'warn' | 'info' | 'error'; t: string }[];
  names: { x: number; y: number; t: string }[];
  devices: Record<string, DeviceInfo>;
  sources: Record<string, SourceInfo>;
  highlight: Record<string, string[]>;
  post: Step[];
  phones: string;
}
export const OVERVIEW = overviewJson as unknown as Overview;

/** 간략 보기의 장비 키(Ag/L4/Dfx) → 보드 id */
export const DEV_BOARD: Record<string, BoardId> = { Ag: 'ag06', L4: 'l4', Dfx: 'dfx12', Qsc: 'dfx12', Mps: 'dfx12' };
