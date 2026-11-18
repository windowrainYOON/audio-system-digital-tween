import type { BoardId } from './data/types';

// 페이지는 하단 탭바 5개뿐(UI_GUIDE 0장 0-1). 예전 #/full(전체 배선도)은 홈으로 합쳤다.
export type Route = 'home' | 'panel' | 'wiring' | 'checks' | 'ops';
export const ROUTES: Route[] = ['home', 'panel', 'wiring', 'checks', 'ops'];
export const BOARDS: BoardId[] = ['ag06', 'dfx12', 'l4'];

let lastBoard: BoardId = 'dfx12';

export function readHash(): { route: Route; board: BoardId } {
  const [t, b] = location.hash.replace(/^#\/?/, '').split('/');
  if ((BOARDS as string[]).includes(b)) lastBoard = b as BoardId;
  const board = lastBoard;
  return { route: (ROUTES as string[]).includes(t) ? (t as Route) : 'home', board };
}
/** 패널 탭은 마지막에 본 믹서로 돌아간다. */
export function go(route: Route, board?: BoardId) {
  if (route === 'panel') lastBoard = board ?? lastBoard;
  location.hash = '/' + route + (route === 'panel' ? '/' + lastBoard : '');
}
