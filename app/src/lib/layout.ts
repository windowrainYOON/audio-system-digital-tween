// 화면 크기 구분 (UI_GUIDE 4.T): 폭 744px 이상이면 태블릿, 그중 가로가 더 길면 가로 배치.
import { useSyncExternalStore } from 'react';

export type Layout = 'mobile' | 'tabletP' | 'tabletL';
const read = (): Layout => {
  const w = window.innerWidth, h = window.innerHeight;
  if (w < 744) return 'mobile';
  return w > h ? 'tabletL' : 'tabletP';
};
const sub = (f: () => void) => { window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); };
export const useLayout = () => useSyncExternalStore(sub, read);
