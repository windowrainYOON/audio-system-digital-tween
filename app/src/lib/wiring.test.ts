// 배선 대체 규칙 (2026-11-17 사용자 결정): 꽂힌 단자를 고르면 원래 케이블은 뽑힌다(서로 바꾸기 아님).
import { describe, expect, it } from 'vitest';
import { create } from '../data/logic/wiring';

describe('케이블 삭제 뒤에도 화면이 그려진다 (흰 화면 버그)', () => {
  it('기본 케이블을 하나씩 지워도 세 보기 모두 오류 없이 그려진다', () => {
    const ids = create().cables.map((x: { id: string }) => x.id);
    for (const id of ids) {
      const c = create();
      c.cables = c.cables.filter((x: { id: string }) => x.id !== id);
      delete c.state.cur[id];
      for (const tab of ['cable', 'src', 'jack']) { c.state.tab = tab; expect(() => c.renderVals()).not.toThrow(); }
    }
  });
});

describe('배선 대체', () => {
  it('꽂힌 단자로 옮기면 원래 케이블은 뽑힘(null)', () => {
    const c = create();
    const next = c.move('c1', 'dxm3', false);
    expect(next.c1).toBe('dxm3');
    expect(next.c3).toBeNull();
    expect(c.lab(next.c3)).toBe('뽑혀 있음 (연결 안 됨)');
  });
  it('케이블 상자에서 꽂힌 단자는 고를 수 있고, 고르면 확인을 묻는다', () => {
    const c = create();
    c.setState({ sel: 'c1', draft: 'dxm1' });
    const item = c.renderVals().opts.flatMap((o: { items: unknown[] }) => o.items).find((i: { name: string }) => i.name === 'CH3 MIC');
    expect(item.dis).toBe(false);
    item.pick();
    const v = c.renderVals();
    expect(v.askOpen).toBe(true);
    v.askYes();
    expect(c.state.cur.c3).toBeNull();
    expect(c.state.cur.c1).toBe('dxm3');
  });
  it('단자별 보기는 믹서별 입력·출력으로 묶인다', () => {
    const titles = create().renderVals().jgroups.map((g: { title: string }) => g.title);
    expect(titles.slice(0, 6)).toEqual(['AG06 · 입력', 'AG06 · 출력', 'L4 · 입력', 'L4 · 출력', 'DFX-12 · 입력', 'DFX-12 · 출력']);
  });
});
