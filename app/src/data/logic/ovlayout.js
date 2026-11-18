// 자동 생성: tools/extract-profiles.cjs (원본 tools/ovlayout.js). 손으로 고치지 마세요.
/* eslint-disable */
// @ts-nocheck
// 홈 배선도 배치 (2026-11-18 사용자 결정): 배선이 바뀌면 소스·중간 장비(DI BOX, 매립형 패널) 상자를
// 꽂힌 단자 위로 다시 배열하고, 케이블마다 다른 통로 높이를 줘서 선이 겹치지 않게 그린다.
// 이 파일 하나를 시안(design/MobOverview.dc.html, tools/inline-ovlayout.py로 붙여 넣음)과
// 앱(app/src/data/logic/ovlayout.js, extract가 복사)이 함께 쓴다. 믹서·앰프 자리는 고정.
// cur(id) → 지금 단자 id(null = 뽑힘), base(id) → 확인한 연결(이와 다르면 노란 선).
export function ovLayout(cur, base) {
  // 고정 장비 단자: [x, y, 들어가는 통로 구역, 옆으로 비껴 들어갈 x(L 아래 R 단자)]
  const J = {
    agx1: [28.6, 111, 'top'], agx2: [53.56, 111, 'top'], ag3l: [79.3, 109.5, 'top'], ag3r: [79.3, 125.6, 'top', 7], ag5l: [104.5, 109.5, 'top'], ag5r: [104.5, 125.6, 'top', 7],
    l4x1: [227.6, 102, 'top'], l4x2: [247, 102, 'top'], l4c1: [228.4, 121, 'top'], l4c2: [247.4, 121, 'top'], l4tl: [266.1, 99, 'top'], l4tr: [266.1, 108.7, 'top', 7],
    dxm1: [35.33, 415, 'mid'], dxm2: [60.15, 415, 'mid'], dxm3: [84.96, 415, 'mid'], dxm4: [109.77, 415, 'mid'], dxm5: [134.58, 415, 'mid'], dxm6: [159.4, 415, 'mid'],
    dx9l: [184.2, 436.8, 'mid'], dx9r: [184.2, 450.7, 'mid', 7], dx11l: [208.9, 436.8, 'mid'], dx11r: [208.9, 450.7, 'mid', 7], dxtl: [231.1, 441.2, 'mid'], dxtr: [231.1, 451.5, 'mid', 7],
    qsl: [352, 760, 'amp'], qsr: [346, 760, 'amp'], mps: [65, 760, 'amp']
  };
  // 통로 띠: [깊은 쪽 y, 얕은 쪽 y] (깊은 쪽 = 장비에 가까운 쪽)
  const BAND = { top: [80, 60], di: [-33, -38], mid: [386, 366], wp: [333, 327] };
  // 케이블: [id, 소스 키(강조), 색, 점선, 시작 상자, 상자 안 칸]
  const C = [
    ['c25', 'Bs', '#6B7280', '', 'Bs', 0], ['c26', 'Gt', '#6B7280', '', 'Gt', 0],
    ['c6', 'Bs', '#444', '', 'Di', 0], ['c7', 'Gt', '#444', '', 'Di', 1],
    ['c8', 'Kb', '#6B7280', '', 'Kb', 0], ['c9', 'Kb', '#6B7280', '', 'Kb', 1],
    ['c10', 'Dr', '#0F766E', '', 'Dr', 0], ['c27', 'Dr', '#0F766E', '', 'Dr', 1],
    ['c13', 'Cd', '#B0B0B0', '', 'Cd', 0], ['c14', 'Cd', '#B0B0B0', '', 'Cd', 1],
    ['c15', 'Pc', '#9a9a9a', '', 'Pc', 0], ['c16', 'Pc', '#E0332B', '', 'Pc', 1],
    ['c23', 'M1', '#444', '', 'M1', 0], ['c24', 'M2', '#444', '', 'M2', 0],
    ['c3', 'M1', '#444', '', 'Wp', 0], ['c4', 'M2', '#444', '', 'Wp', 1], ['c22', 'M3', '#444', '', 'Wp', 2],
    ['c1', 'Gl', '#444', '', 'Gl', 0], ['c2', 'Gr', '#444', '', 'Gr', 0], ['c5', 'Wl', '#444', '', 'Wl', 0],
    ['c11', 'CAg', '#B45309', '4 3', '', 0], ['c12', 'CAg', '#B45309', '4 3', '', 0],
    ['c17', 'CL4', '#9a9a9a', '', '', 0], ['c18', 'CL4', '#E0332B', '', '', 0],
    ['c19', '', '#6B7280', '', '', 0], ['c20', '', '#6B7280', '', '', 0], ['c21', '', '#6B7280', '4 3', '', 0]
  ];
  // 믹서 출력(고정 시작점)과 원래 경로
  const FIX = {
    c11: [128.44, 108.08, 'dx9l', 'M128.44 108.08 V83 H198 V436.8 H184.2'],
    c12: [144.04, 108.08, 'dx9r', 'M144.04 108.08 V81 H188 V450.7 H191.2 H184.2'],
    c17: [283.66, 95.44, 'dxtl', 'M283.66 95.44 V56 H354 V372 H222 V441.2 H231.1'],
    c18: [288.06, 110.4, 'dxtr', 'M288.06 110.4 H297.96 V62 H348 V366 H217 V451.5 H238.1 H231.1'],
    c19: [292.99, 404.21, 'qsl', 'M292.99 404.21 V396 H352 V760'],
    c20: [318, 404.21, 'qsr', 'M318 404.21 V402 H346 V760'],
    c21: [323.8, 434.85, 'mps', 'M323.8 434.85 H340 V752 H65 V760']
  };
  // 상자: [제목, 부제, 기본 가운데 x, y, w, h, 줄(행), 칸 수]
  const B = {
    Bs: ['베이스', '', 15, -60, 30, 20, 'src', 1], Gt: ['통기타', '', 49, -60, 30, 20, 'src', 1],
    Di: ['DI BOX', '', 33, -30, 66, 22, 'top', 2],
    Kb: ['키보드', 'TRS→TS×2', 86, -60, 40, 30, 'top', 2], Dr: ['드럼', 'TS×2→RCA', 130, -60, 40, 30, 'top', 2],
    Cd: ['CD', 'RCA→TS ×2', 227, 0, 42, 40, 'l4', 2], Pc: ['PC (OBS)', 'AUX→RCA', 276, 0, 52, 40, 'l4', 2],
    M1: ['기도석', '마이크', 89, 300, 38, 24, 'mic', 1], M2: ['아래강대상', '마이크', 135, 300, 46, 24, 'mic', 1],
    Wp: ['매립형 XLR 패널', '', 111, 336, 74, 22, 'mid', 3],
    Gl: ['구즈넥 L', '', 17, 336, 34, 22, 'mid', 1], Gr: ['구즈넥 R', '', 53, 336, 34, 22, 'mid', 1], Wl: ['무선', '', 164, 336, 28, 22, 'mid', 1]
  };
  // DI BOX 두 채널, 매립형 패널 세 입력은 상자 안 자리(가운데 기준 오프셋)
  const DI_SLOT = [-16.5, 16.5], WP_SLOT = [-24.8, 0, 24.8];
  const IN = { dii1: ['Di', 0, 'di'], dii2: ['Di', 1, 'di'], wmi1: ['Wp', 0, 'wp'], wmi2: ['Wp', 1, 'wp'], wmi3: ['Wp', 2, 'wp'] };
  const slotX = (k, i, cx) => cx + (k === 'Di' ? DI_SLOT[i] : k === 'Wp' ? WP_SLOT[i] : (i - (B[k][7] - 1) / 2) * Math.min(13, B[k][4] / (B[k][7] + 1)));
  const fixedX = (jid) => (J[jid] ? J[jid][0] : null);
  const mean = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : null);
  const want = (k, zone) => {
    const xs = C.filter((c) => c[4] === k).map((c) => cur(c[0])).filter((j) => j && J[j] && J[j][2] === zone).map((j) => J[j][0] + (J[j][3] || 0) / 2);
    const m = mean(xs);
    return m === null ? B[k][2] : m;
  };
  // 한 줄 배치: 원하는 가운데 x 순서대로 왼쪽부터, 겹치면 밀고, 오른쪽 끝을 넘으면 당긴다
  const pack = (items, lo, hi, gap) => {
    items.sort((a, b) => a.d - b.d);
    let end = lo - gap;
    items.forEach((it) => { it.x = Math.max(it.d - it.w / 2, end + gap, lo); end = it.x + it.w; });
    let start = hi + gap;
    for (let i = items.length - 1; i >= 0; i--) { const it = items[i]; if (it.x + it.w > start - gap) it.x = start - gap - it.w; start = it.x; }
    return items;
  };
  const pos = {};
  // 위 줄: [베이스·통기타 + DI BOX] 묶음, 키보드, 드럼
  const diC = want('Di', 'top');
  const top = pack([{ k: 'G', d: diC, w: 70 }, { k: 'Kb', d: want('Kb', 'top'), w: B.Kb[4] }, { k: 'Dr', d: want('Dr', 'top'), w: B.Dr[4] }], 0, 180, 4);
  top.forEach((it) => {
    if (it.k === 'G') pos.Di = it.x + 2 + B.Di[4] / 2;
    else pos[it.k] = it.x + it.w / 2;
  });
  // 베이스·통기타는 꽂힌 DI 채널 위로
  const diIn = (k) => { const j = cur(k === 'Bs' ? 'c25' : 'c26'); return IN[j] && IN[j][0] === 'Di' ? DI_SLOT[IN[j][1]] : (k === 'Bs' ? DI_SLOT[0] : DI_SLOT[1]); };
  const sg = pack([{ k: 'Bs', d: pos.Di + diIn('Bs'), w: 30 }, { k: 'Gt', d: pos.Di + diIn('Gt'), w: 30 }], pos.Di - 35, pos.Di + 35, 4);
  sg.forEach((it) => { pos[it.k] = it.x + it.w / 2; });
  // L4 줄: CD·PC
  pack([{ k: 'Cd', d: want('Cd', 'top'), w: 42 }, { k: 'Pc', d: want('Pc', 'top'), w: 52 }], 206, 302, 2).forEach((it) => { pos[it.k] = it.x + it.w / 2; });
  // DFX 위 줄: 구즈넥 L·R, 매립형 패널, 무선 (오른쪽은 AG06→DFX 선(x 188) 앞까지)
  pack(['Gl', 'Gr', 'Wp', 'Wl'].map((k) => ({ k, d: want(k, 'mid'), w: B[k][4] })), 0, 182, 2).forEach((it) => { pos[it.k] = it.x + it.w / 2; });
  // 마이크 줄: 꽂힌 패널 입력 위로
  const micW = (k) => { const j = cur(k === 'M1' ? 'c23' : 'c24'); return IN[j] && IN[j][0] === 'Wp' ? pos.Wp + WP_SLOT[IN[j][1]] : B[k][2]; };
  pack([{ k: 'M1', d: micW('M1'), w: 38 }, { k: 'M2', d: micW('M2'), w: 46 }], 0, 186, 4).forEach((it) => { pos[it.k] = it.x + it.w / 2; });

  const boxes = {};
  Object.keys(B).forEach((k) => { const b = B[k]; boxes[k] = { x: Math.round((pos[k] - b[4] / 2) * 10) / 10, y: b[3], w: b[4], h: b[5], dx: Math.round((pos[k] - b[2]) * 10) / 10 }; });

  // 단자 좌표 (DI·패널 입력은 상자 위치를 따른다)
  const jack = (jid) => {
    if (J[jid]) return { x: J[jid][0], y: J[jid][1], zone: J[jid][2], off: J[jid][3] || 0 };
    const p = IN[jid];
    if (!p) return null;
    return { x: Math.round(slotX(p[0], p[1], pos[p[0]]) * 10) / 10, y: B[p[0]][3], zone: p[2], off: 0 };
  };
  const zoneOf = (k) => (B[k][6] === 'src' ? 'di' : B[k][6] === 'mic' ? 'wp' : B[k][6] === 'mid' ? 'mid' : 'top');
  const r1 = (n) => Math.round(n * 10) / 10;

  const wires = [], cut = [], direct = [];
  C.forEach((c, ix) => {
    const id = c[0], jid = cur(id), box = c[4];
    const ch = jid !== base(id);
    let ax, ay;
    if (box) { ax = r1(slotX(box, c[5], pos[box])); ay = B[box][3] + B[box][5]; } else { ax = FIX[id][0]; ay = FIX[id][1]; }
    if (!jid) { cut.push({ key: c[1], x: ax, y: ay + 6, ch: ch }); return; }
    const t = jack(jid);
    if (!t) { cut.push({ key: c[1], x: ax, y: ay + 6, ch: ch }); return; }
    const w = { id: id, key: c[1], color: c[2], dash: c[3], ch: ch, jx: t.x, jy: t.y, d: '' };
    wires.push(w);
    if (!box && jid === FIX[id][2]) { w.d = FIX[id][3]; return; }
    if (box && zoneOf(box) === t.zone && ay < BAND[t.zone][0]) { direct.push({ w: w, ax: ax, ay: ay, t: t }); return; }
    // 다른 구역: 장비 사이 통로로 (L4 쪽·앰프는 오른쪽 끝)
    const k = ix % 4;
    const zs = ay < 84 ? 'top' : ay < 300 ? 'board' : ay < 388 ? 'mid' : 'low';
    const lane = t.zone === 'amp' ? 752 - k * 2 : (BAND[t.zone] ? BAND[t.zone][1] + 1 + k : t.y - 10);
    const cx = t.zone === 'amp' || (ax >= 206 && t.x >= 206) ? 356 - k * 2.5 : 202 - k * 2.5;
    const ya = zs === 'top' ? 56 - k * 2.5 : zs === 'board' ? 46 - k * 3 : zs === 'mid' ? 368 + k * 3 : 382 - k * 3;
    const ex = t.x + t.off;
    w.d = 'M' + ax + ' ' + ay + ' V' + ya + ' H' + cx + ' V' + lane + ' H' + ex + ' V' + t.y + (t.off ? ' H' + t.x : '');
  });
  // 같은 구역 선: 띠 안에서 선마다 다른 높이. 오른쪽으로 가는 선은 왼쪽에서 시작한 것부터 깊게, 왼쪽으로 가는 선은 그 반대.
  [].concat(...Object.keys(BAND).map((z) => [[z, 0], [z, 1]])).forEach(([z, side]) => {
    const g = direct.filter((d) => d.t.zone === z && (d.t.x >= 200 ? 1 : 0) === side);
    const right = g.filter((d) => d.t.x + d.t.off > d.ax + 0.5).sort((a, b) => a.ax - b.ax);
    const left = g.filter((d) => d.t.x + d.t.off < d.ax - 0.5).sort((a, b) => b.ax - a.ax);
    const straight = g.filter((d) => Math.abs(d.t.x + d.t.off - d.ax) <= 0.5);
    const order = right.concat(left);
    const [deep, shallow] = BAND[z];
    const step = order.length > 1 ? (deep - shallow) / (order.length - 1) : 0;
    order.forEach((d, i) => { d.lane = r1(order.length > 1 ? deep - step * i : (deep + shallow) / 2); });
    straight.forEach((d) => { d.lane = null; });
    g.forEach((d) => {
      const ex = r1(d.t.x + d.t.off);
      d.w.d = d.lane === null ? 'M' + d.ax + ' ' + d.ay + ' V' + d.t.y + (d.t.off ? ' H' + d.t.x : '')
        : 'M' + d.ax + ' ' + d.ay + ' V' + d.lane + ' H' + ex + ' V' + d.t.y + (d.t.off ? ' H' + d.t.x : '');
    });
  });
  return { boxes: boxes, wires: wires, cut: cut };
}

