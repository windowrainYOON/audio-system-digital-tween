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

describe('단자 후보 = 모든 입력 (2026-11-18 사용자 결정)', () => {
  const items = (c: ReturnType<typeof create>) => c.renderVals().opts.flatMap((o: { items: unknown[] }) => o.items);
  it('종류가 다른 단자도 보이고, 고르면 팝업 한 번(그래도 꽂기) 뒤 옮겨진다', () => {
    const c = create();
    c.setState({ sel: 'c1', draft: 'dxm1' });
    const all = items(c);
    expect(all.some((i: { name: string }) => i.name === '입력 (5.5)')).toBe(true);
    const tape = all.find((i: { name: string }) => i.name === 'TAPE L');
    expect(tape.diff).toBe(true);
    tape.pick();
    const v = c.renderVals();
    expect(v.ask.title).toBe('단자 종류가 달라요');
    expect(v.ask.ok).toBe('그래도 꽂기');
    expect(v.ask.text).toContain('뽑혀요');
    v.askYes();
    expect(c.state.cur.c1).toBe('l4tl');
    expect(c.state.cur.c15).toBeNull();
    expect(c.state.cur.c16).toBe('l4tr');
  });
  it('L·R 단자는 따로 보이고, 고른 케이블만 옮겨진다 (2026-11-19 사용자 결정)', () => {
    const c = create();
    c.setState({ sel: 'c8', draft: 'ag3l' });
    const all = items(c);
    expect(all.some((i: { name: string }) => i.name === 'CH9/10 R')).toBe(true);
    expect(all.some((i: { name: string }) => i.name.includes('(L·R)'))).toBe(false);
    all.find((i: { name: string }) => i.name === 'CH9/10 R').pick();
    c.renderVals().askYes();
    expect(c.state.cur.c8).toBe('dx9r');
    expect(c.state.cur.c9).toBe('ag3r');
    expect(c.state.cur.c12).toBeNull();
    expect(c.state.cur.c11).toBe('dx9l');
  });
  it('단자별 보기에서 꽂아도 짝 선은 따라가지 않는다', () => {
    const c = create();
    c.setState({ jsel: 'dx11l' });
    c.renderVals().jopts.find((o: { name: string }) => o.name === '전자 드럼 L 출력').pick();
    c.renderVals().askYes();
    expect(c.state.cur.c10).toBe('dx11l');
    expect(c.state.cur.c27).toBe('ag5r');
  });
  it('소스별 보기는 L·R을 따로 보여 준다', () => {
    const c = create();
    c.state.tab = 'src';
    const names = c.renderVals().sgroups.flatMap((g: { rows: { name: string }[] }) => g.rows.map((r) => r.name));
    expect(names).toEqual(expect.arrayContaining(['드럼 L', '드럼 R', 'CD L', 'CD R', '키보드 L', '키보드 R']));
  });
});

describe('노란 변경 알림 확인 (2026-11-18 사용자 결정)', () => {
  it('확인하면 사라지고, 새로 바꾸면 다시 뜬다', () => {
    const c = create();
    c.commit(c.move('c5', 'dxm5', false), {});
    expect(c.renderVals().hasChanges).toBe(true);
    c.renderVals().ackNow();
    expect(c.renderVals().hasChanges).toBe(false);
    c.commit(c.move('c1', 'dxm6', false), {});
    expect(c.renderVals().hasChanges).toBe(true);
  });
});
