// 자동 생성: tools/extract-profiles.cjs (원본 design/ 시안). 손으로 고치지 마세요.
/* eslint-disable */
// @ts-nocheck
class DCLogic { constructor(p) { this.props = p || {}; this.state = {}; } setState(o) { Object.assign(this.state, o); } }

class Component extends DCLogic {
constructor(props) {
super(props);
const defs = this.defs();
const vals = {};
defs.forEach((d) => { vals[d.id] = d.def; });
this.state = { more: false, sel: 'g0', vals: vals, synced: {}, power: true };
const __raw = this.setState.bind(this); this.__raw = __raw; this.__cur = { vals: this.state.vals, synced: this.state.synced, phantom: this.state.phantom };
this.setState = (o, cb) => { __raw(o, cb); if (o && typeof o === 'object' && (o.vals || o.synced || o.phantom !== undefined)) { this.__cur = { vals: o.vals || this.__cur.vals, synced: o.synced || this.__cur.synced, phantom: o.phantom !== undefined ? o.phantom : this.__cur.phantom }; if (this.__save) this.__save(); } };
}
cols() { return [0, 1, 2, 3, 4, 5, 6, 7].map((i) => 103 + 62.5 * i); }
chn() { return ['1', '2', '3', '4', '5/6', '7/8', '9/10', '11/12']; }
defs() {
const out = [];
const cx = this.cols();
const names = this.chn();
const WH = '#f5f5f5', BL = '#2f5fa8', RD = '#b3243b', DK = '#262626';
const K = (id, name, x, y, cap, kind, def, r) => out.push({ id: id, name: name, x: x, y: y, cap: cap, kind: kind, def: def, r: r, type: 'knob' });
const B = (id, name, x, y, kind, def) => out.push({ id: id, name: name, x: x, y: y, kind: kind, def: def, type: 'button' });
const F = (id, name, x, ft, fb, cap, kind, def) => out.push({ id: id, name: name, x: x, ft: ft, fb: fb, cap: cap, kind: kind, def: def, type: 'fader' });
for (let i = 0; i < 8; i++) {
const n = names[i];
K('g' + i, 'CH' + n + ' GAIN', cx[i], 246, WH, 'gain', 0.3, 15);
K('hi' + i, 'CH' + n + ' EQ HI', cx[i], 322, BL, 'tone', 0.5, 13);
K('lo' + i, 'CH' + n + ' EQ LOW', cx[i], 358, BL, 'tone', 0.5, 13);
K('a1' + i, 'CH' + n + ' AUX 1 MON', cx[i], 403, RD, 'level', 0, 13);
K('a2' + i, 'CH' + n + ' AUX 2 EFX', cx[i], 440, RD, 'level', 0, 13);
K('pn' + i, 'CH' + n + ' PAN', cx[i], 490, DK, 'pan', 0.5, 15);
B('mu' + i, 'CH' + n + ' MUTE', cx[i], 526, 'mute', 0);
if (i < 4) B('lc' + i, 'CH' + n + ' LOW CUT 75Hz', cx[i], 285, 'lowcut', 0);
F('f' + i, 'CH' + n + ' 페이더', cx[i], 566, 712, '#f1f1f1', 'fader', 0);
}
F('r1', 'AUX 1 RETURN 페이더', 603, 566, 712, '#a31b3a', 'fader', 0);
F('r2', 'AUX 2/EFX RETURN 페이더', 677, 566, 712, '#a31b3a', 'fader', 0);
F('r3', 'CD/TAPE RETURN 페이더', 745, 566, 712, '#f1f1f1', 'fader', 0);
F('mL', 'MAIN MIX LEFT 페이더', 803, 566, 712, '#2f5fa8', 'fader', 0);
F('mR', 'MAIN MIX RIGHT 페이더', 838, 566, 712, '#2f5fa8', 'fader', 0);
B('mu8', 'AUX 1 RETURN MUTE', 626, 526, 'mute', 0);
B('mu9', 'AUX 2/EFX RETURN MUTE', 700, 526, 'mute', 0);
B('mu10', 'CD/TAPE RETURN MUTE', 768, 526, 'mute', 0);
['60', '250', '1K', '3.5K', '12K'].forEach((f, i) => F('q' + i, 'GRAPHIC EQ ' + f + ' Hz', 607 + 35.5 * i, 262, 318, '#e8e8e8', 'eq', 0.5));
B('meq', 'EQ MAIN/AUX1 전환', 607, 368, 'sw', 0);
B('byp', 'EQ BYPASS', 748, 368, 'sw', 0);
K('fxa', 'EFFECTS TO STAGE MONITOR (AUX 1 레벨)', 606, 404, RD, 'level', 0, 13);
K('fx', '이펙트 선택 다이얼', 706, 440, '#2b2b2b', 'fx', 0.5, 24);
K('s1', 'AUX 1/MON SEND', 606, 490, RD, 'level', 0.5, 14);
K('s2', 'AUX 2/EFX SEND', 678, 490, RD, 'level', 0.5, 14);
B('voc', 'VOCAL ELIMINATOR', 726, 480, 'sw', 0);
B('brk', 'BREAK SWITCH', 726, 502, 'sw', 0);
B('ph', 'PHANTOM POWER +48V', 818, 263, 'phantom', 0);
K('phn', 'PHONES 레벨', 818, 490, '#2b2b2b', 'level', 0.3, 13);
return out;
}
fxNames() { return ['SM. ROOM', 'MD. PLATE', 'LG. PLATE', 'MD. HALL', 'LG. HALL', 'CATHEDRAL', 'GATE', 'REVERB', 'DELAY 1', 'DELAY 2', 'DELAY 3', 'DELAY 4', 'CHORUS', 'FLANGE', 'PHASER', 'SPRING']; }
fmt(d, v) {
const ang = -135 + 270 * v;
const h = (12 + ang / 30) % 12;
const hh = Math.floor(h) || 12;
const mm = Math.round((h - Math.floor(h)) * 60);
const hour = (d.type === 'knob') ? (hh + '시' + (mm ? ' ' + mm + '분' : '')) : '-';
const scale = (d.type === 'knob' && d.kind !== 'fx') ? (v * 10).toFixed(1) : '-';
let db = '';
if (d.type === 'button') db = v ? 'ON' : 'OFF';
else if (d.kind === 'gain') db = '약 ' + (v * 50).toFixed(0) + ' dB (마이크 입력 기준)';
else if (d.kind === 'tone') db = (-15 + 30 * v).toFixed(0) + ' dB';
else if (d.kind === 'eq') db = (-12 + 24 * v).toFixed(0) + ' dB';
else if (d.kind === 'pan') db = v === 0.5 ? '중앙' : ((v < 0.5 ? '왼쪽 ' : '오른쪽 ') + Math.round(Math.abs(v - 0.5) * 200) + '%');
else if (d.kind === 'fader') db = v < 0.03 ? '-∞' : ((v - 0.75) * 48).toFixed(0) + ' dB (U가 0 dB)';
else if (d.kind === 'fx') db = this.fxNames()[Math.round(v * 15)];
else db = v < 0.03 ? '-∞ (꺼짐)' : (v * 10).toFixed(1) + ' / 10';
return { hour: hour, scale: scale, db: db };
}
nameOf(d) {
const DCN = ['1', '2', '3', '4', '5/6', '7/8', '9/10', '11/12'];
const id = d.id;
let t = d.name;
if (/^g\d$/.test(id)) t = 'GAIN';
else if (/^hi\d$/.test(id)) t = 'HI';
else if (/^lo\d$/.test(id)) t = 'LOW';
else if (/^a1\d$/.test(id)) t = 'AUX 1';
else if (/^a2\d$/.test(id)) t = 'AUX 2';
else if (/^pn\d$/.test(id)) t = 'PAN';
else if (/^mu\d+$/.test(id)) t = 'MUTE';
else if (/^lc\d$/.test(id)) t = '로우컷';
else if (/^f\d$/.test(id)) t = 'CH' + DCN[Number(id.charAt(1))];
else if (/^q\d$/.test(id)) t = ['60', '250', '1K', '3.5K', '12K'][Number(id.charAt(1))] + 'Hz';
else t = { r1: 'AUX1 RTN', r2: 'AUX2 RTN', r3: 'CD/TAPE', mL: 'MAIN L', mR: 'MAIN R', meq: 'EQ→AUX1', byp: 'BYPASS', fxa: 'FX→MON', fx: '이펙트', s1: 'AUX1 SEND', s2: 'AUX2 SEND', voc: '보컬제거', brk: 'BREAK', ph: '+48V', phn: 'PHONES' }[id] || d.name;
if (d.type === 'knob') return { x: d.x, y: d.y + d.r + 11, t: t, fs: 10 };
if (d.type === 'button') return { x: d.x, y: d.y + 19, t: t, fs: 10 };
return { x: d.x + 2, y: d.fb + 17, t: t, fs: 10 };
}
flowOf(sel, defs) {
const FL = this.flows();
const f = FL.filter((x) => x.ids.indexOf(sel) >= 0)[0];
if (!f) return { d: '', dots: [], arrow: '', text: '' };
const dots = [];
f.ids.forEach((id) => { const d = defs.filter((q) => q.id === id)[0]; if (d && d.type !== 'fader') dots.push({ x: d.x, y: d.y, r: d.type === 'knob' ? (d.r || 14) + 9 : (d.w ? d.w / 2 + 3 : 18) }); if (d && d.type === 'fader') dots.push({ x: d.x, y: d.fb - 14, r: 16 }); });
(f.jacks || []).concat(f.outs || []).forEach((j) => dots.push({ x: j[0], y: j[1], r: j[2] }));
const x = f.x, y1 = f.y1;
return { d: 'M' + x + ' ' + f.y0 + ' V' + y1, dots: dots, arrow: (x - 9) + ',' + (y1 - 4) + ' ' + (x + 9) + ',' + (y1 - 4) + ' ' + x + ',' + (y1 + 10), text: f.txt };
}
flows() {
const cx = this.cols();
const src = ['구즈넥 L', '구즈넥 R', '매립형 라인 1', '매립형 라인 2', '매립형 라인 3', '무선 마이크', 'AG06', '(빈 입력)'];
const out = [[752, 62, 25], [815, 62, 25]];
const R = [];
for (let i = 0; i < 8; i++) {
const ids = ['g' + i, 'hi' + i, 'lo' + i, 'a1' + i, 'a2' + i, 'pn' + i, 'mu' + i, 'f' + i];
if (i < 4) ids.push('lc' + i);
const jk = i < 6 ? [[cx[i], 68, 25]] : (i === 6 ? [[cx[i], 123, 17], [cx[i], 158, 17]] : []);
const y0 = i < 6 ? 68 : (i === 6 ? 123 : 246);
const port = i < 6 ? 'MIC(XLR) 단자' : (i === 6 ? 'L(MONO)·R 단자' : '입력 없음');
R.push({ ids: ids, x: cx[i], y0: y0, y1: 700, jacks: jk, outs: out, txt: src[i] + ' → ' + port + ' → GAIN → ' + (i < 4 ? 'LOW CUT → ' : '') + 'EQ HI·LOW → AUX 1·2 → PAN → MUTE → 페이더 → MAIN MIX → MAIN OUT L·R(XLR) → QSC 메인 앰프' });
}
R.push({ ids: ['mL', 'mR'], x: 820, y0: 540, y1: 700, outs: out, txt: '모든 채널 믹스 → MAIN MIX 페이더 L·R → MAIN OUT L·R(XLR) → QSC 메인 앰프' });
R.push({ ids: ['r3', 'mu10'], x: 745, y0: 540, y1: 700, jacks: [[596, 134, 15], [596, 160, 15]], txt: 'L4 MAIN OUT L·R → CD/TAPE IN(RCA) → CD/TAPE MUTE → CD/TAPE 페이더 → MAIN MIX' });
R.push({ ids: ['r1', 'mu8'], x: 603, y0: 540, y1: 700, jacks: [[592, 42, 16], [633, 42, 16]], txt: 'STEREO AUX RETURN 1 → AUX 1 RETURN MUTE → 페이더 → MAIN MIX' });
R.push({ ids: ['r2', 'mu9'], x: 677, y0: 540, y1: 700, jacks: [[592, 85, 16], [633, 85, 16]], txt: 'STEREO AUX RETURN 2 → AUX 2/EFX RETURN MUTE → 페이더 → MAIN MIX' });
return R;
}

renderVals() {
const s = this.state;
const self = this;
const defs = this.defs();
const sel = defs.filter((d) => d.id === s.sel)[0];
const fv = this.flowOf(s.sel, defs);
const v = s.vals[s.sel];
const f = this.fmt(sel, v);
const synced = s.synced[s.sel] !== false;
const dot = (id) => (s.synced[id] === false ? 1 : 0);
const ring = (id) => (id === s.sel ? '#2DD4BF' : 'transparent');
const knobs = defs.filter((d) => d.type === 'knob').map((d) => {
const val = s.vals[d.id];
const ang = -135 + 270 * val;
const rad = (ang - 90) * Math.PI / 180;
return { id: d.id,
x: d.x, y: d.y, r: d.r, rr: d.r + 5, cap: d.cap, name: d.name,
ptr: (d.cap === '#f5f5f5') ? '#111111' : '#ffffff',
l1: -d.r * 0.2, l2: -d.r * 0.95,
tf: 'translate(' + d.x + ',' + d.y + ') rotate(' + ang + ')',
ring: ring(d.id),
dx: d.x + d.r * Math.cos(rad), dy: d.y + d.r * Math.sin(rad), dotOp: dot(d.id),
nmx: self.nameOf(d).x, nmy: self.nameOf(d).y, nmf: self.nameOf(d).fs, nm: self.nameOf(d).t, pick: () => self.setState({ sel: d.id })
};
});
const faders = defs.filter((d) => d.type === 'fader').map((d) => {
const val = s.vals[d.id];
const wide = d.kind === 'eq' ? 18 : 28;
const cy = d.fb - 26 - val * (d.fb - d.ft - 26);
return { id: d.id,
ya: d.fb - 26, yb: -(d.fb - d.ft - 26), sx: d.x - 2.5, ft: d.ft, fh: d.fb - d.ft, cx: d.x - wide / 2, cy: cy, cw: wide, cap: d.cap, name: d.name,
ring: d.id === s.sel ? '#2DD4BF' : '#555', dx: d.x + wide / 2, dotOp: dot(d.id),
nmx: self.nameOf(d).x, nmy: self.nameOf(d).y, nmf: self.nameOf(d).fs, nm: self.nameOf(d).t, pick: () => self.setState({ sel: d.id })
};
});
const buttons = defs.filter((d) => d.type === 'button').map((d) => {
const on = s.vals[d.id] === 1;
const red = (d.kind === 'mute' || d.kind === 'phantom');
const col = red ? '#E0332B' : '#2DD4BF';
return { id: d.id,
x: d.x - 14, y: d.y - 8, w: 28, h: 16, dx: d.x + 14, name: d.name, cx: d.x, ty: d.y + 3, fs: 8,
fill: on ? col : '#5E6166', ring: d.id === s.sel ? '#2DD4BF' : (on ? '#1B1F23' : '#3A3C40'), glow: col, glowOp: on ? 1 : 0,
onOp: on ? 1 : 0, offOp: on ? 0 : 1, tcol: red ? '#FFFFFF' : '#05302A', dotOp: dot(d.id),
nmx: self.nameOf(d).x, nmy: self.nameOf(d).y, nmf: self.nameOf(d).fs, nm: self.nameOf(d).t, pick: () => self.setState({ sel: d.id })
};
});
const cx = this.cols();
const names = this.chn();
const texts = [];
const T = (x, y, t, sz, c, a) => texts.push({ x: x, y: y, t: t, s: sz || 9, c: c || '#EDEDED', a: a || 'middle' });
for (let i = 0; i < 8; i++) {
const n = names[i];
T(cx[i], 30, i < 6 ? '← ' + ['구즈넥 L', '구즈넥 R', '매립형 1', '매립형 2', '매립형 3', '무선'][i] : (i === 6 ? '← AG06' : '(빈 입력)'), 8, '#7DE0D0');
T(cx[i], 20, n, 11);
T(cx[i], 107, i < 4 ? 'LINE IN' : 'L(MONO)', 8);
T(cx[i], 142, i < 4 ? 'INSERT' : 'R', 8);
T(cx[i], 562, n, 12, '#EDEDED');
}
T(603, 538, 'AUX 1 RETURN', 8); T(677, 538, 'AUX 2/EFX', 8); T(745, 538, 'CD/TAPE', 8); T(820, 538, 'MAIN MIX', 9);
T(785, 202, 'POWER', 8); T(820, 232, 'PHANTOM +48V', 8);
T(622, 14, 'STEREO AUX RETURN', 8); 
T(596, 118, 'IN ← L4', 8, '#7DE0D0'); T(636, 118, 'TAPE OUT', 8);
T(677, 20, 'AUX SEND', 8); T(695, 46, '1 MON', 8, '#EDEDED', 'start'); T(695, 90, '2 EFX', 8, '#EDEDED', 'start');
T(684, 178, 'EFX FOOT SWITCH', 7);
T(752, 97, 'LEFT → QSC', 8, '#FDBA74'); T(815, 97, 'RIGHT → QSC', 8, '#FDBA74'); T(783, 141, 'PHONES → MPS1200', 9, '#FDBA74');
T(607, 260, '60', 8); T(642, 260, '250', 8); T(678, 260, '1K', 8); T(713, 260, '3.5K', 8); T(749, 260, '12K', 8);
T(560, 330, 'EQ', 9);
T(730, 405, 'EMAC', 8);
const lamps = [{ x: 820, y: 215, fill: s.power ? '#E0332B' : '#4A1A18' }, { x: 820, y: 245, fill: s.vals.ph === 1 ? '#F2C200' : '#4D4A2A' }];
for (let i = 0; i < 8; i++) { lamps.push({ x: cx[i] - 28, y: 218, fill: '#d8a800' }); }
const jacks = [];
const pins = [];
const J = (x, y, k) => {
const o = { x: x, y: y, r: 14, hr: 6, fill: '#111111', stroke: '#BDBDBD', sw: 3, hf: '#2E2E2E' };
if (k === 'xlr') { o.r = 21; o.hr = 0; o.stroke = '#9A9A9A'; o.sw = 2; pins.push({ x: x - 8.5, y: y - 5, r: 3 }, { x: x + 8.5, y: y - 5, r: 3 }, { x: x, y: y + 11, r: 3 }); }
if (k === 'rcaw') { o.r = 11; o.hr = 4; o.fill = '#F5F5F5'; o.stroke = '#CCCCCC'; }
if (k === 'rcar') { o.r = 11; o.hr = 4; o.fill = '#E0332B'; o.stroke = '#CCCCCC'; }
jacks.push(o);
};
for (let i = 0; i < 8; i++) {
if (i < 6) J(cx[i], 68, 'xlr');
J(cx[i], 123, 'ts'); J(cx[i], 158, 'ts');
}
J(592, 42, 'ts'); J(633, 42, 'ts'); J(592, 85, 'ts'); J(633, 85, 'ts');
J(596, 134, 'rcaw'); J(596, 160, 'rcar'); J(636, 134, 'rcaw'); J(636, 160, 'rcar');
J(677, 42, 'ts'); J(677, 85, 'ts'); J(684, 157, 'ts');
J(752, 62, 'xlr'); J(815, 62, 'xlr'); J(752, 118, 'ts'); J(815, 118, 'ts'); J(815, 160, 'ts');
const jumpTo = (x, y) => () => { const el = document.getElementById('pan'); if (el) el.scrollTo({ left: Math.max(0, (x - 0.0) * 0.9 - 12), top: Math.max(0, (y - -150.0) * 0.9 - 12), behavior: 'smooth' }); };
const chips = [["마이크 입력", 40, -150], ["CH5~12 입력", 330, -150], ["GAIN·EQ·AUX", 40, 230], ["페이더", 40, 540], ["리턴·EQ", 580, 200], ["MAIN", 760, -100]].map((c) => ({ label: c[0], go: jumpTo(c[1], c[2]) }));

const fmtDb = (db) => db;
const effOf = (d, v, f, src, extra) => {
  let e = '';
  const db = f.db;
  if (d.type === 'button') {
    return v === 1 ? (extra && extra.on) || '켜짐' : (extra && extra.off) || '꺼짐';
  }
  if (d.kind === 'gain') e = '지금 ' + db + ' 만큼 키우는 위치예요. 시계 방향으로 올리면 ' + src + '의 소리가 커지고, 너무 올리면 찌그러져요(PEAK). 반시계로 내리면 소리가 작아지고 잡음이 상대적으로 커져요.';
  else if (d.kind === 'tone') e = v > 0.55 ? ('지금 ' + db + ' 만큼 올린 상태예요. ' + src + '의 ' + ((extra && extra.hi) ? extra.hi : '해당 음역') + '이 더 강해져요.') : (v < 0.45 ? ('지금 ' + db + ' 만큼 줄인 상태예요. ' + src + '의 ' + ((extra && extra.hi) ? extra.hi : '해당 음역') + '이 약해져요.') : '가운데(12시)라서 ' + src + '의 소리를 바꾸지 않아요. 시계 방향은 강하게, 반시계 방향은 약하게 만들어요.');
  else if (d.kind === 'eq') e = '지금 ' + db + ' 위치예요. 위로 올리면 ' + src + ' 중 이 주파수 대역이 커지고, 아래로 내리면 줄어요.';
  else if (d.kind === 'pan') e = v < 0.45 ? '왼쪽으로 치우친 상태예요. ' + src + '의 소리가 왼쪽 스피커에서 더 크게 나와요.' : (v > 0.55 ? '오른쪽으로 치우친 상태예요. ' + src + '의 소리가 오른쪽 스피커에서 더 크게 나와요.' : '가운데예요. ' + src + '의 소리가 왼쪽·오른쪽에 똑같이 나가요.');
  else e = (v < 0.03 ? '지금 맨 아래(꺼짐)라서 ' + src + '의 소리가 나지 않아요. ' : '지금 ' + db + ' 위치예요. ') + '올리면 ' + src + '의 소리가 커지고 내리면 작아져요.' + ((extra && extra.lv) ? ' ' + extra.lv : '');
  return e;
};

const DCH = ['강대상1 구즈넥 L', '강대상1 구즈넥 R', '매립형 XLR 라인 1 (기도석 추정)', '매립형 XLR 라인 2 (아래강대상 추정)', '매립형 XLR 라인 3 (예비 추정)', '무선 마이크', 'AG06 (DI·드럼·키보드)', '(비어 있음) 11/12번'];
const DCN = ['1', '2', '3', '4', '5/6', '7/8', '9/10', '11/12'];
const dsrc = (i) => 'CH' + DCN[i] + ' · ' + DCH[i];
const explain = (d, v, f) => {
  const id = d.id;
  let m;
  const ix = (re) => { const r = re.exec(id); return r ? Number(r[1]) : -1; };
  let i;
  if ((i = ix(/^g(\d)$/)) >= 0) return { title: 'GAIN', desc: 'CH' + DCN[i] + ' 입력 감도(GAIN). 잭으로 들어온 소리를 믹서가 다루기 좋은 크기로 키워요.', src: dsrc(i), eff: effOf(d, v, f, DCH[i], null) };
  if ((i = ix(/^hi(\d)$/)) >= 0) return { title: 'EQ HI', desc: 'CH' + DCN[i] + ' 고음(HI, 12kHz) 조절. 소리의 밝기와 또렷함을 바꿔요.', src: dsrc(i), eff: effOf(d, v, f, DCH[i], { hi: '고음' }) };
  if ((i = ix(/^lo(\d)$/)) >= 0) return { title: 'EQ LOW', desc: 'CH' + DCN[i] + ' 저음(LOW, 80Hz) 조절. 소리의 두께와 웅웅거림을 바꿔요.', src: dsrc(i), eff: effOf(d, v, f, DCH[i], { hi: '저음' }) };
  if ((i = ix(/^a1(\d)$/)) >= 0) return { title: 'AUX 1 MON', desc: 'CH' + DCN[i] + ' 소리를 무대 모니터(AUX 1)로 보내는 양이에요. 메인 스피커 소리에는 영향이 없어요.', src: dsrc(i), eff: (v < 0.03 ? '지금 0이라서 모니터로 보내지 않아요. ' : '지금 ' + (v * 10).toFixed(1) + ' 위치예요. ') + '올리면 ' + DCH[i] + ' 소리가 AUX 1 출력으로 더 크게 나가요. 지금 AUX 1 잭에 연결된 모니터가 없으면 들리는 변화는 없어요.' };
  if ((i = ix(/^a2(\d)$/)) >= 0) return { title: 'AUX 2 EFX', desc: 'CH' + DCN[i] + ' 소리를 내장 이펙트(AUX 2/EFX)로 보내는 양이에요.', src: dsrc(i), eff: (v < 0.03 ? '지금 0이라서 이펙트가 걸리지 않아요. ' : '지금 ' + (v * 10).toFixed(1) + ' 위치예요. ') + '올리면 ' + DCH[i] + ' 소리에 잔향 같은 이펙트가 더 많이 섞여요. 이펙트 소리는 AUX2/EFX RETURN 페이더로 메인에 돌아와요.' };
  if ((i = ix(/^pn(\d)$/)) >= 0) return { title: 'PAN', desc: 'CH' + DCN[i] + ' 소리를 메인 왼쪽·오른쪽 스피커 중 어느 쪽에 둘지 정해요.', src: dsrc(i), eff: effOf(d, v, f, DCH[i], null) };
  if ((i = ix(/^lc(\d)$/)) >= 0) return { title: 'LOW CUT 75Hz', desc: 'CH' + DCN[i] + ' 75Hz 아래의 아주 낮은 소리를 잘라내는 스위치예요.', src: dsrc(i), eff: v === 1 ? '켜짐: ' + DCH[i] + '의 낮은 웅웅거림·바람 소리·쿵 하는 잡음이 줄어요. 말소리는 조금 가벼워질 수 있어요.' : '꺼짐: 낮은 소리를 그대로 통과시켜요.' };
  if ((i = ix(/^mu(\d)$/)) >= 0 && i < 8) return { title: 'MUTE', desc: 'CH' + DCN[i] + ' 소리를 끄는 스위치예요.', src: dsrc(i), eff: v === 1 ? '켜짐(뮤트): ' + DCH[i] + ' 소리가 메인과 AUX에 아예 나가지 않아요.' : '꺼짐: ' + DCH[i] + ' 소리가 정상적으로 나가요.' };
  if ((i = ix(/^f(\d)$/)) >= 0) return { title: 'CH' + DCN[i] + ' 페이더', desc: 'CH' + DCN[i] + ' 음량 페이더. 이 채널 소리가 메인 믹스에서 차지하는 크기를 정해요.', src: dsrc(i), eff: effOf(d, v, f, DCH[i], { lv: '"U"(0dB) 근처에서 시작해 말소리를 들으며 조절하세요.' }) };
  if (id === 'mu8') return { title: 'AUX 1 RETURN MUTE', desc: 'AUX 1 리턴(이펙트·모니터 되돌림)을 끄는 스위치.', src: 'AUX 1 리턴 입력 (지금은 비어 있음)', eff: v === 1 ? '켜짐: AUX 1 리턴이 메인에 들어가지 않아요.' : '꺼짐: AUX 1 리턴이 정상적으로 들어가요.' };
  if (id === 'mu9') return { title: 'AUX 2/EFX RETURN MUTE', desc: 'AUX 2/EFX 리턴(내장 이펙트 소리)을 끄는 스위치.', src: '내장 이펙트 소리', eff: v === 1 ? '켜짐: 이펙트 소리가 메인에 돌아오지 않아요. 마이크에 걸린 잔향이 사라져요.' : '꺼짐: 이펙트 소리가 메인에 섞여요.' };
  if (id === 'mu10') return { title: 'CD/TAPE RETURN MUTE', desc: 'CD/TAPE 입력(L4에서 오는 소리)을 끄는 스위치.', src: 'L4 MAIN OUT (CD·PC)', eff: v === 1 ? '켜짐: L4의 CD·PC 소리가 메인에 나가지 않아요.' : '꺼짐: L4의 CD·PC 소리가 정상적으로 나가요.' };
  if (id === 'r1') return { title: 'AUX 1 RETURN', desc: 'AUX 1 리턴 페이더. AUX 1 쪽으로 되돌아오는 소리를 메인에 섞는 양.', src: 'AUX 1 리턴 입력 (지금은 비어 있음)', eff: '지금 AUX 1 리턴 잭이 비어 있어 올려도 소리 변화는 없어요.' };
  if (id === 'r2') return { title: 'AUX 2/EFX RETURN', desc: '내장 이펙트가 만든 소리를 메인에 섞는 양을 정하는 페이더.', src: '내장 이펙트 (마이크 등 AUX 2 EFX로 보낸 소리)', eff: effOf(d, v, f, '이펙트(잔향) 소리', { lv: '채널의 AUX 2 EFX 노브로 보낸 소리에만 이펙트가 걸려요.' }) };
  if (id === 'r3') return { title: 'CD/TAPE RETURN', desc: 'CD/TAPE 입력 레벨 페이더. L4에서 넘어온 CD·PC 소리를 메인에 섞는 양.', src: 'L4 MAIN OUT L·R → CD/TAPE IN (CD·PC 스테레오)', eff: effOf(d, v, f, 'L4의 CD·PC 소리', null) };
  if (id === 'mL') return { title: 'MAIN MIX LEFT', desc: '메인 믹스 왼쪽 최종 페이더. 모든 채널 소리가 이 페이더를 지나 QSC 앰프 왼쪽으로 가요.', src: '모든 입력 소스의 왼쪽 합 → MAIN OUT L(XLR) → QSC', eff: effOf(d, v, f, '모든 소스(왼쪽)', { lv: '왼쪽 스피커 전체 음량이 함께 변해요.' }) };
  if (id === 'mR') return { title: 'MAIN MIX RIGHT', desc: '메인 믹스 오른쪽 최종 페이더. 모든 채널 소리가 이 페이더를 지나 QSC 앰프 오른쪽으로 가요.', src: '모든 입력 소스의 오른쪽 합 → MAIN OUT R(XLR) → QSC', eff: effOf(d, v, f, '모든 소스(오른쪽)', { lv: 'R 스피커가 약할 때는 이 페이더가 왼쪽(MAIN MIX LEFT)보다 낮지 않은지 먼저 확인하세요.' }) };
  if ((i = ix(/^q(\d)$/)) >= 0) { const hz = ['60', '250', '1K', '3.5K', '12K'][i]; return { title: '그래픽 EQ ' + hz + 'Hz', desc: '5밴드 그래픽 EQ의 ' + hz + 'Hz 대역. 이 대역의 소리를 키우거나 줄여요.', src: 'EQ MAIN/AUX1 스위치에 따라 메인 믹스 전체 또는 AUX 1 모니터', eff: effOf(d, v, f, '메인 믹스(모든 소스)', null) }; }
  if (id === 'meq') return { title: 'EQ MAIN/AUX1', desc: '그래픽 EQ를 메인 믹스에 쓸지 AUX 1 모니터에 쓸지 고르는 스위치.', src: '메인 믹스 또는 AUX 1', eff: v === 1 ? '켜짐: EQ가 AUX 1(무대 모니터) 쪽에 걸려요. 메인 스피커 음색은 EQ의 영향을 받지 않아요.' : '꺼짐: EQ가 메인 믹스(QSC로 가는 소리)에 걸려요.' };
  if (id === 'byp') return { title: 'EQ BYPASS', desc: '그래픽 EQ 효과를 통째로 끄는 스위치.', src: 'EQ가 걸리는 출력', eff: v === 1 ? '켜짐: EQ를 건너뛰어요. 위 EQ 페이더를 움직여도 소리는 안 변해요.' : '꺼짐: EQ가 적용돼요.' };
  if (id === 'fxa') return { title: 'EFFECTS TO STAGE MONITOR', desc: '이펙트 소리를 AUX 1(무대 모니터)로 보내는 양.', src: '내장 이펙트 → AUX 1', eff: '올리면 이펙트(잔향)가 모니터 쪽에도 들려요. 지금 AUX 1에 연결된 모니터가 없으면 변화는 없어요.' };
  if (id === 'fx') { const n = this.fxNames()[Math.round(v * 15)]; return { title: '이펙트 선택', desc: '내장 이펙트 종류(16가지)를 고르는 다이얼.', src: 'AUX 2 EFX로 보낸 소리', eff: '지금 "' + n + '" 이펙트예요. 마이크 소리에 걸려요. 돌리면 잔향·딜레이·코러스 등 효과 종류가 바뀌어요.' }; }
  if (id === 's1') return { title: 'AUX 1/MON SEND', desc: 'AUX 1(무대 모니터) 출력 전체 음량.', src: '각 채널의 AUX 1 MON으로 보낸 소리 합', eff: '지금 AUX 1 잭에 연결된 모니터가 없으면 변화는 없어요.' };
  if (id === 's2') return { title: 'AUX 2/EFX SEND', desc: '내장 이펙트로 들어가는 소리 전체 양.', src: '각 채널의 AUX 2 EFX로 보낸 소리 합', eff: effOf(d, v, f, '이펙트로 보낸 소리', null) };
  if (id === 'voc') return { title: 'VOCAL ELIMINATOR', desc: 'CD/TAPE 입력에서 가운데 소리(보통 보컬)를 줄이는 스위치.', src: 'L4 → CD/TAPE IN (CD·PC 음악)', eff: v === 1 ? '켜짐: CD·PC 음악의 보컬이 줄어들어요(반주만 남는 효과). 스테레오 음원에서만 효과가 있어요.' : '꺼짐: CD·PC 음악이 그대로 나가요.' };
  if (id === 'brk') return { title: 'BREAK SWITCH', desc: '휴식 시간에 음악만 틀기 위한 스위치 (일반 설명).', src: 'CD/TAPE 입력', eff: v === 1 ? '켜짐: 휴식 모드예요. 평소 마이크 채널 소리가 줄어들고 CD/TAPE 음악이 우선돼요.' : '꺼짐: 평소와 같아요.' };
  if (id === 'ph') return { title: 'PHANTOM POWER +48V', desc: 'XLR 마이크 입력에 48V 전원을 보내는 스위치. 콘덴서 마이크·액티브 DI에 필요해요.', src: 'XLR 입력 1~6번 (강대상1 구즈넥·매립형 XLR 라인)', eff: v === 1 ? '켜짐: 모든 XLR 마이크 입력에 48V가 들어가요. 콘덴서 마이크가 아니면 필요 없어요. 켜기 전에 MAIN을 내리세요.' : '꺼짐: 다이내믹 마이크·무선 수신기는 꺼진 상태로 써요.' };
  if (id === 'phn') return { title: 'PHONES 레벨', desc: 'PHONES 잭으로 나가는 소리의 크기.', src: '메인 믹스 → PHONES 잭 → MPS1200', eff: effOf(d, v, f, '메인 믹스 소리', { lv: 'MPS1200에 연결된 모니터로 가는 소리도 이 레벨의 영향을 받아요.' }) };
  return { title: d.name, desc: d.name, src: '-', eff: '-' };
};
const infoOf = (d, v, f) => explain.call(self, d, v, f);
const nm = (d) => {
  const id = d.id;
  const ix = (re) => { const r = re.exec(id); return r ? Number(r[1]) : -1; };
  if (/^g\d$/.test(id)) return 'GAIN';
  if (/^hi\d$/.test(id)) return 'HI';
  if (/^lo\d$/.test(id)) return 'LOW';
  if (/^a1\d$/.test(id)) return 'AUX 1';
  if (/^a2\d$/.test(id)) return 'AUX 2';
  if (/^pn\d$/.test(id)) return 'PAN';
  if (/^mu\d+$/.test(id)) return 'MUTE';
  if (/^lc\d$/.test(id)) return '로우컷';
  if (/^f\d$/.test(id)) return 'CH' + DCN[Number(id.charAt(1))];
  if (/^q\d$/.test(id)) return ['60', '250', '1K', '3.5K', '12K'][Number(id.charAt(1))] + 'Hz';
  return { r1: 'AUX1 RTN', r2: 'AUX2 RTN', r3: 'CD/TAPE', mL: 'MAIN L', mR: 'MAIN R', meq: 'EQ→AUX1', byp: 'BYPASS', fxa: 'FX→MON', fx: '이펙트', s1: 'AUX1 SEND', s2: 'AUX2 SEND', voc: '보컬제거', brk: 'BREAK', ph: '+48V', phn: 'PHONES' }[id] || d.name;
};
const nameList = defs.map((d) => {
  if (d.type === 'knob') return { x: d.x, y: d.y + d.r + 10, t: nm(d), fs: 9 };
  if (d.type === 'button') return { x: d.x, y: d.y + 18, t: nm(d), fs: 9 };
  return { x: d.x + 2, y: d.fb + 16, t: nm(d), fs: 9 };
});
const info = infoOf(sel, v, f);
const setV = (nv) => {
nv = Math.max(0, Math.min(1, nv));
const dd0 = defs.filter((d) => d.id === self.state.sel)[0];
if (dd0 && dd0.kind === 'fx') nv = Math.round(nv * 15) / 15;
const vs = Object.assign({}, self.state.vals);
vs[self.state.sel] = nv;
const sy0 = Object.assign({}, self.state.synced);
sy0[self.state.sel] = false;
self.setState({ vals: vs, synced: sy0 });
};
return {
chips: chips, names: nameList, selInfo: info, more: s.more, toggleMore: () => self.setState({ more: !self.state.more }), moreLabel: s.more ? '설명 접기' : '설명 보기', aPh: 0,
flowD: fv.d, flowDots: fv.dots, flowArrow: fv.arrow, flowText: fv.text, hasFlow: !!fv.text, knobs: knobs, faders: faders, buttons: buttons, texts: [], textsBake: texts, lamps: lamps, jacks: jacks, pins: pins,
sel: { isKnob: sel.type === 'knob', isFad: sel.type === 'fader', capc: sel.cap || '#f5f5f7', ptrc: (sel.cap === '#1a1a1a' || sel.cap === '#111' || sel.cap === '#222') ? '#ffffff' : '#111111', dialTf: 'rotate(' + (-135 + 270 * v) + ' 66 66)', fy: 10 + (1 - v) * 136 - 11, fyc: 10 + (1 - v) * 136, name: sel.name, v100: Math.round(v * 100), hour: f.hour, scale: f.scale, db: f.db,
isBtn: sel.type === 'button', isCont: sel.type !== 'button',
toggleLabel: v === 1 ? 'ON (눌러서 끄기)' : 'OFF (눌러서 켜기)',
badge: synced ? '실물과 일치' : '실물 확인 필요', badgeBg: synced ? '#DDF5EE' : '#FDE7C8', badgeFg: synced ? '#0B4F47' : '#7A3E00' },
onDial: (e) => {
if (e.type === 'pointermove' && !(e.buttons & 1)) return;
if (e.type === 'pointerdown' && e.currentTarget.setPointerCapture) { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {} }
const r = e.currentTarget.getBoundingClientRect();
let a = Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180 / Math.PI;
a = Math.max(-135, Math.min(135, a));
setV((a + 135) / 270);
},
onFad: (e) => {
if (e.type === 'pointermove' && !(e.buttons & 1)) return;
if (e.type === 'pointerdown' && e.currentTarget.setPointerCapture) { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {} }
const r = e.currentTarget.getBoundingClientRect();
const yv = (e.clientY - r.top) * 156 / r.height;
setV(1 - (yv - 10) / 136);
},
stepUp: () => setV(v + 0.05),
stepDn: () => setV(v - 0.05),
onSlide: (e) => {
let nv = Number(e.target.value) / 100;
const dd = defs.filter((d) => d.id === self.state.sel)[0];
if (dd.kind === 'fx') nv = Math.round(nv * 15) / 15;
const vals = Object.assign({}, self.state.vals);
vals[self.state.sel] = nv;
const sy = Object.assign({}, self.state.synced);
sy[self.state.sel] = false;
self.setState({ vals: vals, synced: sy });
},
onToggle: () => {
const vals = Object.assign({}, self.state.vals);
vals[self.state.sel] = vals[self.state.sel] === 1 ? 0 : 1;
const sy = Object.assign({}, self.state.synced);
sy[self.state.sel] = false;
self.setState({ vals: vals, synced: sy });
},
markSynced: () => {
const sy = Object.assign({}, self.state.synced);
sy[self.state.sel] = true;
self.setState({ synced: sy });
},
togglePower: () => self.setState({ power: !self.state.power }),
powerLabel: s.power ? '전원 ON' : '전원 OFF',
powerBg: s.power ? '#2DD4BF' : '#5B6168',
powerFg: s.power ? '#0B1F1D' : '#F4F3EE'
};
}
}

export function create() { return new Component({}); }
