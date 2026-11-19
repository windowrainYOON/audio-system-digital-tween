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
  src = src.replace(/\/\/ PINCH-BEGIN[\s\S]*?\/\/ PINCH-END\n/, ''); // 핀치는 앱이 직접(usePinch)
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
  // 2026-11-18: 소스·중간 장비(DI BOX, 매립형 XLR 패널) 상자. 케이블은 배선 데이터(wires)로 앱이 그린다.
  // [key, 제목, 부제, x, y, w, h, 누르면 소스 흐름]
  // 위치는 기본 자리. 배선이 바뀌면 앱이 ovLayout(시안과 같은 tools/ovlayout.js)으로 옮긴다. chs: 상자 안 채널 칸(가운데 x 오프셋). 스테레오 출력이 L·R 단자로 따로인 소스(드럼, CD)도 L·R 칸(2026-11-19)
  [['Bs', '베이스', '', 0, -60, 30, 20, 1], ['Gt', '통기타', '', 34, -60, 30, 20, 1], ['Di', 'DI BOX', '', 0, -30, 66, 22, 0],
    ['Kb', '키보드', 'TRS→TS×2', 66, -60, 40, 30, 1], ['Dr', '드럼', 'TS×2→RCA', 110, -60, 40, 30, 1],
    ['Cd', 'CD', 'RCA→TS ×2', 206, 0, 42, 40, 1], ['Pc', 'PC (OBS)', 'AUX→RCA', 250, 0, 52, 40, 1],
    ['M1', '기도석', '마이크', 70, 300, 38, 24, 1], ['M2', '아래강대상', '마이크', 112, 300, 46, 24, 1], ['Wp', '매립형 XLR 패널', '', 74, 336, 74, 22, 0],
    ['Gl', '구즈넥 L', '', 0, 336, 34, 22, 1], ['Gr', '구즈넥 R', '', 36, 336, 34, 22, 1], ['Wl', '무선', '', 150, 336, 28, 22, 1]]
    .forEach(([k, t, sub, x, y, w, h, c]) => { sbox(k, x, y, w, h, t, sub, '', k === 'Dr' ? '#DDF5EE' : c ? '#fff' : '#F4F3EE', k === 'Dr' ? '#0F766E' : '#9aa0a6'); boxes[boxes.length - 1].src = !!c; if (k === 'Di') boxes[boxes.length - 1].chs = [['CH1', -16.5], ['CH2', 16.5]]; if (k === 'Wp') boxes[boxes.length - 1].chs = [['CH1', -24.8], ['CH2', 0], ['CH3', 24.8]]; if (k === 'Dr' || k === 'Cd') boxes[boxes.length - 1].chs = [['L', -w / 4], ['R', w / 4]]; });
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
  const H = 1004;
  // 원래 연결은 시안 MobOverview의 ORIG. 케이블 경로·상자 위치는 앱이 ovLayout으로 계산한다(data/logic/ovlayout.js)
  const ORIG = new Function(src.match(/const ORIG = \{[^\n]*\};/)[0] + ';return ORIG;')();
  const ov = { width: 358, height: H, top: -64, boards, wires: Object.keys(ORIG).map((id) => ({ id, orig: ORIG[id] })), cables: cables.map((c) => ({ ...c, d: c.d.replace(/(\d+\.\d{3,})/g, (m) => String(num(+m))) })), boxes, badges, names, devices: data.I, sources: data.S, highlight: data.on, post: data.post, phones: data.phones };
  fs.writeFileSync(path.join(OUT, 'overview.json'), JSON.stringify(ov, null, 1));
  console.log('overview cables', cables.length, 'boxes', boxes.length, 'sources', Object.keys(data.S).length);
}
overview();
// 홈 배치 계산(2026-11-18): tools/ovlayout.js를 시안과 앱이 함께 쓴다
{
  const lay = fs.readFileSync(path.join(ROOT, 'tools', 'ovlayout.js'), 'utf8');
  fs.writeFileSync(path.join(OUT, 'logic', 'ovlayout.js'), '// 자동 생성: tools/extract-profiles.cjs (원본 tools/ovlayout.js). 손으로 고치지 마세요.\n/* eslint-disable */\n// @ts-nocheck\n' + lay.replace('function ovLayout(', 'export function ovLayout(') + '\n');
  console.log('ovlayout');
}
// M5 배선 편집: 케이블·단자 목록과 편집 규칙(짝 선 추천, 어댑터 안내, 자리 교체)을 시안 코드 그대로 쓴다.
writeLogic('wiring', fs.readFileSync(path.join(DESIGN, 'MobWiring.dc.html'), 'utf8'));
console.log('wiring logic');
writeLogic('operator', fs.readFileSync(path.join(DESIGN, 'Mobile.dc.html'), 'utf8'));
console.log('operator logic');
