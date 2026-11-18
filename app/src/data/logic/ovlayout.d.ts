export interface OvBox { x: number; y: number; w: number; h: number; dx: number }
export interface OvWire { id: string; key: string; color: string; dash: string; ch: boolean; jx: number; jy: number; d: string }
export interface OvCut { key: string; x: number; y: number; ch: boolean }
export function ovLayout(cur: (id: string) => string | null | undefined, base: (id: string) => string | null | undefined): { boxes: Record<string, OvBox>; wires: OvWire[]; cut: OvCut[] };
