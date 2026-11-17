import type { BoardId } from './data/types';

export type Route = 'home' | 'full' | 'panel' | 'wiring' | 'checks' | 'ops';
export const ROUTES: Route[] = ['home', 'full', 'panel', 'wiring', 'checks', 'ops'];
export const BOARDS: BoardId[] = ['ag06', 'dfx12', 'l4'];

export function readHash(): { route: Route; board: BoardId } {
  const [t, b] = location.hash.replace(/^#\/?/, '').split('/');
  return {
    route: (ROUTES as string[]).includes(t) ? (t as Route) : 'home',
    board: (BOARDS as string[]).includes(b) ? (b as BoardId) : 'dfx12',
  };
}
export function go(route: Route, board?: BoardId) {
  location.hash = '/' + route + (route === 'panel' && board ? '/' + board : '');
}
