// 시안(design/*.dc.html) → 앱 데이터(app/src/data/*.json) 변환기.
// 사용: node tools/extract-profiles.cjs   (저장소 루트에서)
// 시안의 도면·좌표·공식을 그대로 옮긴다. 시안을 고치면 이 스크립트를 다시 돌린다.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DESIGN = path.join(ROOT, 'design');
const OUT = path.join(ROOT, 'app', 'src', 'data');
fs.mkdirSync(path.join(OUT, 'profiles'), { recursive: true });

class DCLogic { constructor(p) { this.props = p || {}; this.state = {}; } setState(o) { Object.assign(this.state, o); } }
const fakeDoc = { getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; } };
const fakeWin = { localStorage: { getItem() { return null; }, setItem() {} }, addEventListener() {} };

function load(file) {
  const t = fs.readFileSync(path.join(DESIGN, file), 'utf8');
  const src = t.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
  const C = new Function('DCLogic', 'React', 'document', 'window', src + ';return Component;')(DCLogic, {}, fakeDoc, fakeWin);
  return { t, c: new C({}) };
}

const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
const num = (x) => Math.round(x * 100) / 100;

// 정적 도면: 컨트롤·흐름·경고처럼 값에 따라 바뀌는 부분은 빼고, 나머지를 renderVals로 채운다.
function staticArt(t, v) {
  let svg = t.match(/<svg id="pansvg"[\s\S]*?<\/svg>\s*(?=<div style="height)/)[0];
  const open = svg.match(/^<svg[^>]*>/)[0];
  const viewBox = open.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  // 시안은 확대 배율(z)에 따라 width/height를 {{pw}}/{{ph}}로 바꾼다. 앱에는 배율 1의 크기를 넘긴다.
  const wm = open.match(/ width="(\d+)"/), hm = open.match(/ height="(\d+)"/);
  const size = wm && hm ? [Number(wm[1]), Number(hm[1])] : [Number(v.pw), Number(v.ph)];
  svg = svg.slice(open.length).replace(/<\/svg>\s*$/, '');
  svg = svg.replace(/<sc-for list="\{\{(knobs|faders|buttons|flowDots)\}\}"[\s\S]*?<\/sc-for>/g, '');
  svg = svg.split('\n').filter((l) => !/\{\{(flowD|flowArrow|aPh|phantomFill|phantomKnobX)\}\}/.test(l)).join('\n');
  svg = svg.replace(/<sc-for list="\{\{(\w+)\}\}" as="(\w+)"[^>]*>([\s\S]*?)<\/sc-for>/g, (m, l, a, body) =>
    (v[l] || []).map((it) => body.replace(/\{\{([\w.]+)\}\}/g, (mm, p) => { const x = get({ [a]: it }, p); return x == null ? '' : x; })).join(''));
  svg = svg.replace(/<sc-if[^>]*>|<\/sc-if>/g, '');
  const left = svg.match(/\{\{[^}]+\}\}/g);
  if (left) throw new Error('채워지지 않은 값: ' + left.join(', '));
  svg = svg.replace(/ onClick="[^"]*"/g, '').replace(/^\s*<rect x="-?\d+" y="-?\d+" width="\d+" height="\d+" fill="#FFFFFF"\/>/, '');
  svg = svg.replace(/\n\s+/g, '\n').trim();
  return { viewBox, size, art: svg };
}

// 시안의 값 표기·설명 로직(fmt, selInfo, 신호 흐름 문구)을 그대로 실행하려고 컴포넌트 코드를 모듈로 옮긴다.
// 앱은 이 모듈로 시안과 똑같은 "시계·눈금·아날로그 값"과 "이 컨트롤이 하는 일" 문구를 얻는다.
function writeLogic(id, t) {
  let src = t.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
  src = src.replace(/\/\/ SYNC-BEGIN[\s\S]*?\/\/ SYNC-END/, '');
  const out = `// 자동 생성: tools/extract-profiles.cjs (원본 design/ 시안). 손으로 고치지 마세요.
/* eslint-disable */
// @ts-nocheck
class DCLogic { constructor(p) { this.props = p || {}; this.state = {}; } setState(o) { Object.assign(this.state, o); } }
${src}
export function create() { return new Component({}); }
`;
  fs.mkdirSync(path.join(OUT, 'logic'), { recursive: true });
  fs.writeFileSync(path.join(OUT, 'logic', id + '.js'), out);
}

function profile(file, id, title, opts) {
  const { t, c } = load(file);
  const defs = c.defs();
  const v = c.renderVals();
  const byId = Object.fromEntries(defs.map((d) => [d.id, d]));
  const { viewBox, size, art } = staticArt(t, v);
  // 구역 이동 칩: [이름, x, y] (시안 jumpTo와 같은 좌표)
  const cm = t.match(/chips = (\[\[[\s\S]*?\]\])\.map/);
  const chips = cm ? JSON.parse(cm[1].replace(/'/g, '"')) : [];
  writeLogic(id, t);
  const controls = [];
  for (const k of v.knobs || []) {
    const d = byId[k.id] || {};
    controls.push({
      id: k.id, type: 'knob', name: k.name, kind: d.kind || 'level', def: d.def ?? 0,
      x: k.x, y: k.y, r: k.r ?? 17, rr: k.rr ?? 22, cap: k.cap, ptr: k.ptr,
      l1: num(k.l1 ?? -3), l2: num(k.l2 ?? -16), stroke: opts.knobStroke,
    });
  }
  for (const f of v.faders || []) {
    const d = byId[f.id] || {};
    const isL4 = f.tx !== undefined;
    controls.push({
      id: f.id, type: 'fader', name: f.name, kind: d.kind || 'fader', def: d.def ?? 0,
      track: isL4 ? { x: f.tx, y: 566, w: 4, h: 110 } : { x: f.sx, y: f.ft, w: 5, h: f.fh },
      handle: isL4 ? { x: f.hx, w: 20, h: 10, rx: 2, fill: '#E8E8E8', sw: 2 } : { x: f.cx, w: f.cw, h: 26, rx: 3, fill: f.cap, sw: 3 },
      ya: isL4 ? 666 : f.ya, yb: isL4 ? -100 : f.yb, ring: isL4 ? '#777' : '#555',
    });
  }
  for (const b of v.buttons || []) {
    const d = byId[b.id] || {};
    controls.push({
      id: b.id, type: 'button', name: b.name, kind: d.kind || 'sw', def: d.def ?? 0,
      x: b.x, y: b.y, w: b.w, h: b.h, cx: b.cx, ty: b.ty, fs: b.fs, on: b.glow, rx: opts.btnRx,
    });
  }
  // 정의(defs)에는 있지만 그림에 없는 값(예: L4 팬텀)은 extra로 남긴다
  const drawn = new Set(controls.map((x) => x.id));
  const extra = defs.filter((d) => !drawn.has(d.id)).map((d) => ({ id: d.id, name: d.name, type: d.type, kind: d.kind, def: d.def }));
  const flows = typeof c.flows === 'function' ? c.flows() : [];
  // 인스펙터 설명: 시안의 selInfo(desc·src)를 컨트롤마다 뽑는다 (값에 따라 바뀌는 eff 문구는 앱에서 계산)
  for (const ctl of controls) {
    c.state.sel = ctl.id;
    const si = c.renderVals().selInfo || {};
    ctl.desc = si.desc || '';
    ctl.src = si.src || '';
  }
  const p = {
    id, title, source: 'design/' + file,
    formula: { knob: 'rotate(-135 + 270*v)', fader: 'y = ya + yb*v', button: 'on = v === 1' },
    viewBox, size, chips, controls, extra, flows, art,
  };
  if (opts.phantom) p.phantom = opts.phantom;
  fs.writeFileSync(path.join(OUT, 'profiles', id + '.json'), JSON.stringify(p, null, 1));
  console.log(id, 'controls', controls.length, 'extra', extra.length, 'flows', flows.length, 'art', art.length);
  return p;
}

profile('MobAg06.dc.html', 'ag06', 'Yamaha AG06', { knobStroke: '#555', btnRx: 4 });
profile('MobDfx.dc.html', 'dfx12', 'Mackie DFX-12', { knobStroke: '#222', btnRx: 3 });
profile('MobL4.dc.html', 'l4', 'MiCWL L4', {
  knobStroke: '#777', btnRx: 3,
  phantom: { lamp: { cx: 385, cy: 436, r: 4, on: '#E0332B', off: '#5A2A2A' }, knob: { y: 448, w: 15, h: 16, xOn: 389, xOff: 374 } },
});

// ── 간략 보기(M1) 배치: tools/common.js geo()와 같은 좌표를 구조 데이터로 ──
function overview() {
  const AGs = 0.26, AGx = 0, AGy = 84, L4s = 0.22, L4x = 206, L4y = 84, DFs = 0.397, DFx = 0, DFy = 388;
  const ag = (x, y) => [AGx + x * AGs, AGy + y * AGs], l4 = (x, y) => [L4x + (x - 112) * L4s, L4y + (y - 290) * L4s], df = (x, y) => [DFx + (x - 14) * DFs, DFy + y * DFs];
  const boards = [
    { key: 'Ag', board: 'ag06', x: AGx, y: AGy, scale: AGs, crop: [0, 0, 602, 770] },
    { key: 'L4', board: 'l4', x: L4x, y: L4y, scale: L4s, crop: [112, 290, 604, 545] },
    { key: 'Dfx', board: 'dfx12', x: DFx, y: DFy, scale: DFs, crop: [14, 0, 900, 840] },
  ];
  const cables = [], boxes = [];
  const cable = (key, d, color, dash, label, lx, ly) => cables.push({ key, d, color, dash: dash || '', label: label || '', lx, ly });
  const sbox = (key, x, y, w, h, title, sub, sub2, fill, stroke) => boxes.push({ key, x, y, w, h, title, sub: sub || '', sub2: sub2 || '', fill: fill || '#fff', stroke: stroke || '#9aa0a6' });
  sbox('Bs', 0, 0, 56, 30, '베이스', 'DI BOX');
  sbox('Kb', 60, 0, 42, 30, '키보드', 'TRS→TS×2');
  sbox('Gt', 34, 38, 42, 30, '기타', 'DI BOX');
  sbox('Dr', 84, 38, 38, 30, '드럼', 'TS×2→RCA', '', '#DDF5EE', '#0F766E');
  const A1 = ag(110, 0)[0], A2 = ag(206, 0)[0], A3 = ag(305, 0)[0], A5 = ag(402, 0)[0];
  cable('Bs', `M${A1} 30 V105.5`, '#444', 0, 'XLR', A1 + 2, 92);
  cable('Gt', `M${A2} 68 V105.5`, '#444', 0, 'XLR', A2 + 2, 92);
  cable('Kb', `M${A3} 30 V105.5`, '#6B7280', 0, 'TS ×2', A3 + 2, 50);
  cable('Dr', `M${A5} 68 V106.5`, '#0F766E', 0, 'RCA', A5 + 2, 92);
  sbox('Cd', 206, 0, 42, 40, 'CD', 'RCA→TS', '×2');
  sbox('Pc', 250, 0, 52, 40, 'PC (OBS)', 'AUX→RCA');
  const c1 = l4(160, 0)[0], c2 = l4(254, 0)[0], pw = l4(334, 0)[0], pr = l4(358, 0)[0];
  cable('Cd', `M${c1} 40 V84`, '#B0B0B0'); cable('Cd', `M${c2} 40 V84`, '#B0B0B0');
  cable('Pc', `M${pw} 40 V84`, '#9a9a9a'); cable('Pc', `M${pr} 40 V84`, '#E0332B');
  sbox('Gl', 4, 302, 58, 24, '구즈넥 L');
  sbox('M1', 66, 302, 40, 24, '매립형 1');
  sbox('M3', 110, 302, 52, 24, '매립형 3');
  sbox('Gr', 38, 332, 44, 24, '구즈넥 R');
  sbox('M2', 88, 332, 44, 24, '매립형 2');
  sbox('Wl', 137, 332, 31, 24, '무선');
  const jt = DFy + (68 - 21) * DFs;
  [['Gl', 103, 326], ['Gr', 165.5, 356], ['M1', 228, 326], ['M2', 290.5, 356], ['M3', 353, 326], ['Wl', 415.5, 356]]
    .forEach(([k, cx, y0]) => cable(k, `M${df(cx, 0)[0]} ${y0} V${jt}`, '#444'));
  const [ol, olY] = ag(494, 108), [or, orY] = ag(554, 108);
  const [d1x, d1y] = df(478, 123), [d2x, d2y] = df(478, 158);
  cable('CAg', `M${ol} ${olY - 4} V50 H196 V${d1y} H${d1x + 5.8}`, '#B45309', '4 3', '5.5 TS ×2 (L·R)', 150, 46);
  cable('CAg', `M${or} ${orY - 4} V58 H173 V${d2y} H${d2x - 5.8}`, '#B45309', '4 3');
  const [m1x, m1y] = l4(465, 362), [m2x, m2y] = l4(465, 410), [t1x, t1y] = df(596, 134), [t2x, t2y] = df(596, 160);
  const rx = l4(530, 0)[0];
  cable('CL4', `M${m1x} ${m1y - 4.4} V56 H354 V368 H222 V${t1y} H${t1x - 4.6}`, '#9a9a9a', 0, 'RCA ×2 → CD/TAPE IN', 226, 366);
  cable('CL4', `M${m2x + 4.4} ${m2y} H${rx} V62 H348 V360 H217 V${t2y} H${t2x - 4.6}`, '#E0332B');
  const [o1x, o1y] = df(752, 62), [o2x, o2y] = df(815, 62), [p1x, p1y] = df(815, 118);
  cable('', `M${o1x} ${o1y - 8.4} V396 H352 V760`, '#6B7280');
  cable('', `M${o2x} ${o2y - 8.4} V402 H346 V760`, '#6B7280');
  cable('', `M${p1x + 5.8} ${p1y} H340 V752 H65 V760`, '#6B7280', '4 3', 'PHONES', 120, 749);
  sbox('Qsc', 240, 760, 118, 40, 'QSC 메인 앰프', 'MAIN OUT L·R');
  sbox('Mps', 0, 760, 130, 40, 'MPS1200 서브 앰프', 'PHONES → 입력');
  ['M268 800 V830', 'M330 800 V830', 'M65 800 V830', 'M268 866 V896', 'M330 866 V896'].forEach((d) => cable('', d, '#6B7280'));
  sbox('', 240, 830, 56, 36, '메인 스피커 L'); sbox('', 302, 830, 56, 36, '메인 스피커 R', '약함', '', '#fff', '#ff9500');
  sbox('', 20, 830, 90, 36, '자모실 스피커', 'MPS1200');
  sbox('', 240, 896, 56, 36, '모니터 L'); sbox('', 302, 896, 56, 36, '모니터 R');
  const badges = [[152, 88, 'warn', '!'], [352, 392, 'info', 'i'], [352, 762, 'warn', '!'], [124, 762, 'error', '×'], [352, 832, 'warn', '!']]
    .map(([x, y, level, t]) => ({ x, y, level, t }));
  const names = [{ x: 0, y: 296, t: 'Yamaha AG06' }, { x: 206, y: 226, t: 'MiCWL L4' }, { x: 0, y: 740, t: 'Mackie DFX-12' }];

  // 하단 카드 문구와 소스별 강조 묶음은 시안 MobOverview의 renderVals에서 그대로 가져온다
  const t = fs.readFileSync(path.join(DESIGN, 'MobOverview.dc.html'), 'utf8');
  const scripts = [...t.matchAll(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const src = scripts.find((s) => s.includes('const I = {'));
  const body = src.slice(src.indexOf("const W = '"), src.indexOf('const sv = S['));
  const cleaned = body.replace(/const mk = [^\n]*\n/, '').replace(/const ms = [^\n]*\n/, '').replace(/const r = [^\n]*\n/, '');
  const data = new Function('s', 'self', cleaned + ';return {I, S, on, post, phones};')({}, {});
  const H = 940;
  const ov = { width: 358, height: H, boards, cables: cables.map((c) => ({ ...c, d: c.d.replace(/(\d+\.\d{3,})/g, (m) => String(num(+m))) })), boxes, badges, names, devices: data.I, sources: data.S, highlight: data.on, post: data.post, phones: data.phones };
  fs.writeFileSync(path.join(OUT, 'overview.json'), JSON.stringify(ov, null, 1));
  console.log('overview cables', cables.length, 'boxes', boxes.length, 'sources', Object.keys(data.S).length);
}
overview();
// M5 배선 편집: 케이블·단자 목록과 편집 규칙(짝 선 추천, 어댑터 안내, 자리 교체)을 시안 코드 그대로 쓴다.
writeLogic('wiring', fs.readFileSync(path.join(DESIGN, 'MobWiring.dc.html'), 'utf8'));
console.log('wiring logic');
writeLogic('operator', fs.readFileSync(path.join(DESIGN, 'Mobile.dc.html'), 'utf8'));
console.log('operator logic');
