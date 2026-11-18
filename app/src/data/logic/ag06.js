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
this.state = { more: false, sel: 'gn1', vals: vals, synced: {}, power: true };
const __raw = this.setState.bind(this); this.__raw = __raw; this.__cur = { vals: this.state.vals, synced: this.state.synced, phantom: this.state.phantom };
this.setState = (o, cb) => { __raw(o, cb); if (o && typeof o === 'object' && (o.vals || o.synced || o.phantom !== undefined)) { this.__cur = { vals: o.vals || this.__cur.vals, synced: o.synced || this.__cur.synced, phantom: o.phantom !== undefined ? o.phantom : this.__cur.phantom }; if (this.__save) this.__save(); } };
}
defs() {
const out = [];
const BK = '#1a1a1a', SV = '#d9d9d9';
const K = (id, name, x, y, cap, kind, def) => out.push({ id: id, name: name, x: x, y: y, cap: cap, kind: kind, def: def, r: 17, type: 'knob' });
const B = (id, name, x, y, w, h, kind, def) => out.push({ id: id, name: name, x: x, y: y, w: w, h: h, kind: kind, def: def, type: 'button' });
B('ph', 'CH1 +48V', 88, 229, 40, 22, 'phantom', 1);
B('pad1', 'CH1 PAD', 132, 229, 40, 22, 'sw', 0);
B('gtr', 'CH2 GUITAR', 184, 229, 40, 22, 'sw', 0);
B('pad2', 'CH2 PAD', 228, 229, 40, 22, 'sw', 0);
B('gh34', '3/4 GAIN HIGH/LOW', 305, 229, 40, 22, 'sw', 0);
B('gh56', '5/6 GAIN HIGH/LOW', 402, 229, 40, 22, 'sw', 0);
K('gn1', 'CH1 GAIN', 110, 444, BK, 'gain', 0.4);
K('gn2', 'CH2 GAIN', 206, 444, BK, 'gain', 0.4);
B('ce1', 'CH1 COMP/EQ', 110, 494, 40, 22, 'sw', 0);
B('am2', 'CH2 AMP SIM', 206, 494, 40, 22, 'sw', 0);
B('ef1', 'CH1 EFFECT', 110, 550, 40, 22, 'sw', 0);
B('ef2', 'CH2 EFFECT', 206, 550, 40, 22, 'sw', 0);
K('lv1', 'CH1 MIC 레벨', 110, 654, SV, 'level', 0.6);
K('lv2', 'CH2 MIC/GTR 레벨', 206, 654, SV, 'level', 0.6);
K('lv34', '3/4 키보드 레벨', 305, 654, SV, 'level', 0.6);
K('lv56', '5/6 드럼 레벨', 402, 553, SV, 'level', 0.6);
K('lvu', 'USB 레벨', 402, 654, SV, 'level', 0);
B('lb', 'LOOPBACK', 402, 498, 40, 22, 'sw', 0);
B('mm', 'MONITOR MUTE', 524, 494, 40, 22, 'mute', 0);
K('msp', 'MONITOR SPEAKER 레벨', 524, 573, SV, 'level', 0.5);
K('mph', 'MONITOR PHONES 레벨', 524, 654, SV, 'level', 0.3);
return out;
}
fmt(d, v) {
const ang = -135 + 270 * v;
const h = (12 + ang / 30) % 12;
const hh = Math.floor(h) || 12;
const mm = Math.round((h - Math.floor(h)) * 60);
const hour = d.type === 'knob' ? (hh + '시' + (mm ? ' ' + mm + '분' : '')) : '-';
const scale = d.type === 'knob' ? (v * 10).toFixed(1) : '-';
let db = '';
if (d.type === 'button') db = v ? 'ON' : 'OFF';
else if (d.kind === 'gain') db = '약 ' + (v * 50).toFixed(0) + ' dB (마이크 입력 기준)';
else db = v < 0.03 ? '-∞ (꺼짐)' : (v * 10).toFixed(1) + ' / 10';
return { hour: hour, scale: scale, db: db };
}
nameOf(d) {
const m = { ph: '+48V', pad1: 'PAD', gtr: 'GUITAR', pad2: 'PAD', gh34: 'GAIN H/L', gh56: 'GAIN H/L', gn1: 'GAIN', gn2: 'GAIN', ce1: 'COMP/EQ', am2: 'AMP SIM', ef1: 'EFFECT', ef2: 'EFFECT', lv1: 'CH1 MIC', lv2: 'CH2 MIC/GTR', lv34: '3/4 KEYBD', lv56: '5/6 DRUM', lvu: 'USB', lb: 'LOOPBACK', mm: 'MONITOR MUTE', msp: 'MONITOR SPKR', mph: 'MONITOR PHONES' };
if (d.type === 'knob') return { x: d.x, y: d.y + d.r + 12, t: m[d.id] || d.name, fs: 11 };
return { x: d.x, y: d.y + d.h / 2 + 13, t: m[d.id] || d.name, fs: 11 };
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
const T = ' → STEREO OUT L·R → DFX-12 9/10';
const O = [[494, 108, 21], [554, 108, 21]];
return [
{ ids: ['ph', 'pad1', 'gn1', 'ce1', 'ef1', 'lv1'], x: 110, y0: 104, y1: 700, jacks: [[110, 104, 28]], outs: O, txt: '베이스 → DI BOX 1 → CH1 XLR 단자 → +48V·PAD → GAIN → COMP/EQ → EFFECT → CH1 MIC 레벨' + T },
{ ids: ['gtr', 'pad2', 'gn2', 'am2', 'ef2', 'lv2'], x: 206, y0: 104, y1: 700, jacks: [[206, 104, 28]], outs: O, txt: '기타 → DI BOX 2 → CH2 XLR 단자 → GUITAR·PAD → GAIN → AMP SIM → EFFECT → CH2 MIC/GTR 레벨' + T },
{ ids: ['gh34', 'lv34'], x: 305, y0: 98, y1: 700, jacks: [[305, 98, 20], [305, 160, 20]], outs: O, txt: '키보드 TRS → TS ×2 → 3/4 L/MONO·R 단자 → GAIN H/L → 3/4 레벨' + T },
{ ids: ['gh56', 'lv56'], x: 402, y0: 98, y1: 590, jacks: [[402, 98, 19], [402, 160, 19]], outs: O, txt: '드럼 TS 모노 ×2 → RCA → 5/6 L·R 단자 → GAIN H/L → 5/6 레벨' + T },
{ ids: ['lvu'], x: 402, y0: 625, y1: 695, outs: O, txt: 'PC USB 재생음 → USB 레벨' + T },
{ ids: ['mm', 'msp'], x: 524, y0: 484, y1: 600, outs: [[494, 172, 21], [554, 172, 21]], txt: '믹스 → MONITOR MUTE → MONITOR SPEAKER 레벨 → MON OUT L·R 단자' },
{ ids: ['mph'], x: 524, y0: 630, y1: 695, outs: [[494, 236, 21]], txt: '믹스 → MONITOR PHONES 레벨 → PHONES 단자' }
];
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
const knobs = defs.filter((d) => d.type === 'knob').map((d) => {
const val = s.vals[d.id];
const ang = -135 + 270 * val;
const rad = (ang - 90) * Math.PI / 180;
return { id: d.id,
x: d.x, y: d.y, r: d.r, rr: d.r + 5, cap: d.cap, name: d.name,
ptr: d.cap === '#1a1a1a' ? '#ffffff' : '#111111', l1: -3, l2: -16,
tf: 'translate(' + d.x + ',' + d.y + ') rotate(' + ang + ')',
ring: d.id === s.sel ? '#2DD4BF' : 'transparent',
dx: d.x + d.r * Math.cos(rad), dy: d.y + d.r * Math.sin(rad), dotOp: dot(d.id),
nmx: self.nameOf(d).x, nmy: self.nameOf(d).y, nmf: self.nameOf(d).fs, nm: self.nameOf(d).t, pick: () => self.setState({ open: true, sel: d.id })
};
});
const buttons = defs.filter((d) => d.type === 'button').map((d) => {
const on = s.vals[d.id] === 1;
const red = (d.kind === 'mute' || d.kind === 'phantom');
const col = red ? '#E0332B' : '#2DD4BF';
return { id: d.id,
x: d.x - d.w / 2, y: d.y - d.h / 2, w: d.w, h: d.h, dx: d.x + d.w / 2, name: d.name, cx: d.x, ty: d.y + 3.6, fs: 10,
fill: on ? col : '#5E6166', ring: d.id === s.sel ? '#2DD4BF' : (on ? '#1B1F23' : '#3A3C40'), glow: col, glowOp: on ? 1 : 0,
onOp: on ? 1 : 0, offOp: on ? 0 : 1, tcol: red ? '#FFFFFF' : '#05302A', dotOp: dot(d.id),
nmx: self.nameOf(d).x, nmy: self.nameOf(d).y, nmf: self.nameOf(d).fs, nm: self.nameOf(d).t, pick: () => self.setState({ open: true, sel: d.id })
};
});
const texts = [];
const T = (x, y, t, sz, c, a) => texts.push({ x: x, y: y, t: t, s: sz || 10, c: c || '#26282B', a: a || 'middle' });
T(110, 138, 'IN 베이스(DI)', 9, '#0F766E'); T(206, 138, 'IN 기타(DI)', 9, '#0F766E');
T(305, 124, 'IN 키보드 L', 9, '#0F766E'); T(305, 186, 'IN 키보드 R', 9, '#0F766E');
T(402, 123, 'IN 드럼 (L)', 9, '#0F766E'); T(402, 185, 'IN 드럼 (R)', 9, '#0F766E');
T(494, 133, 'OUT→9/10 L', 9, '#B45309'); T(554, 133, 'OUT→9/10 R', 9, '#B45309');
T(494, 197, 'MON OUT L', 9); T(554, 197, 'MON OUT R', 9);
T(494, 261, 'PHONES', 9); T(554, 261, 'FOOT SW', 9);
T(110, 296, '1', 14); T(206, 296, '2', 14); T(305, 296, '3/4', 14); T(402, 296, '5/6', 14);
T(110, 338, '+48V', 9);
T(110, 628, 'PEAK', 9); T(206, 628, 'PEAK', 9);
T(402, 340, 'HEADSET', 9); T(378, 396, 'MIC', 8); T(426, 396, 'PHONES', 8); T(402, 464, 'AUX', 9);
T(524, 326, 'POWER', 9); T(494, 376, 'PEAK L', 8); T(554, 376, 'PEAK R', 8); T(494, 418, 'SIG L', 8); T(554, 418, 'SIG R', 8);
const lamps = [
{ x: 110, y: 361, fill: s.vals.ph === 1 ? '#E0332B' : '#4A1A18' },
{ x: 110, y: 602, fill: '#4A1A18' }, { x: 206, y: 602, fill: '#4A1A18' },
{ x: 494, y: 390, fill: '#4A1A18' }, { x: 554, y: 390, fill: '#4A1A18' },
{ x: 494, y: 432, fill: '#2FBF4A' }, { x: 554, y: 432, fill: '#2FBF4A' },
{ x: 524, y: 342, fill: s.power ? '#2DD4BF' : '#334' }
];
const jacks = [];
const pins = [];
const J = (x, y, k) => {
const o = { x: x, y: y, r: 15, hr: 6.5, fill: '#111111', stroke: '#BDBDBD', sw: 3, hf: '#2E2E2E' };
if (k === 'xlr') { o.r = 22; o.hr = 0; o.stroke = '#9A9A9A'; o.sw = 2; pins.push({ x: x - 9, y: y - 5, r: 3.2 }, { x: x + 9, y: y - 5, r: 3.2 }, { x: x, y: y + 12, r: 3.2 }); }
if (k === 'rcaw') { o.r = 12; o.hr = 4.5; o.fill = '#F5F5F5'; o.stroke = '#CCCCCC'; }
if (k === 'rcar') { o.r = 12; o.hr = 4.5; o.fill = '#E0332B'; o.stroke = '#CCCCCC'; }
jacks.push(o);
};
J(110, 104, 'xlr'); J(206, 104, 'xlr');
J(305, 98, 'ts'); J(305, 160, 'ts');
J(402, 98, 'rcaw'); J(402, 160, 'rcar');
J(494, 108, 'ts'); J(554, 108, 'ts'); J(494, 172, 'ts'); J(554, 172, 'ts'); J(494, 236, 'ts'); J(554, 236, 'ts');
J(378, 372, 'ts'); J(426, 372, 'ts'); J(402, 440, 'ts');
const jumpTo = (x, y) => () => { const el = document.getElementById('pan'); if (el) el.scrollTo({ left: Math.max(0, (x - -10.0) * 0.9 * (self.state.z || 1) - 12), top: Math.max(0, (y - -130.0) * 0.9 * (self.state.z || 1) - 12), behavior: 'smooth' }); };
const chips = [["입력 소스", -10, -130], ["CH1·2", 60, 200], ["3/4·5/6", 270, 200], ["레벨", 60, 560], ["출력", 440, 300]].map((c) => ({ label: c[0], go: jumpTo(c[1], c[2]) }));

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

const A = {
  ph: ['CH1 +48V (팬텀)', 'CH1 XLR 입력에 48V를 보내는 스위치. 콘덴서 마이크·액티브 DI에 필요해요.', 'CH1 XLR ← DI BOX (베이스·기타)', '켜짐: CH1에 연결된 DI BOX에 48V가 들어가요. 패시브 DI라면 꺼 두세요. 전원이 필요 없는 소스에는 영향이 없지만 연결 중에 켜면 큰 잡음이 날 수 있어요.', '꺼짐: 48V가 나가지 않아요. 액티브 DI나 콘덴서 마이크라면 소리가 안 날 수 있어요.'],
  pad1: ['CH1 PAD', '입력 신호를 크게 줄이는 스위치. 너무 큰 소리가 들어올 때 써요.', 'CH1 XLR ← DI BOX (베이스·기타)', '켜짐: CH1 입력이 크게 줄어요(약 -26dB). 소리가 작아지고 찌그러짐이 사라져요.', '꺼짐: 입력을 그대로 받아요.'],
  gtr: ['CH2 GUITAR', 'CH2를 기타 직결(하이임피던스) 입력으로 바꾸는 스위치. 기타를 직접 꽂을 때만 써요.', 'CH2 ← DI BOX (통기타)', '켜짐: CH2가 기타 직결 모드예요. DI BOX로 받는 중이면 소리가 이상해질 수 있어요.', '꺼짐: 마이크·라인 입력 모드(DI BOX 사용 중에는 꺼 두세요).'],
  pad2: ['CH2 PAD', '입력 신호를 크게 줄이는 스위치.', 'CH2 ← DI BOX (통기타)', '켜짐: CH2 입력이 크게 줄어요.', '꺼짐: 입력을 그대로 받아요.'],
  gh34: ['3/4 GAIN HIGH/LOW', '3/4 입력의 감도를 HIGH(크게 키움)·LOW(작게 키움)로 바꾸는 스위치.', '3/4 L/MONO·R ← 키보드 (TRS 출력 → TS ×2)', '켜짐(HIGH 쪽): 키보드 소리가 더 크게 들어와요. 작게 들리면 켜 보세요.', '꺼짐(LOW 쪽): 키보드 소리가 작게 들어와요. 찌그러지면 이쪽으로.'],
  gh56: ['5/6 GAIN HIGH/LOW', '5/6 입력의 감도를 HIGH·LOW로 바꾸는 스위치.', '5/6 RCA L·R ← 드럼 (TS 모노 ×2 → RCA)', '켜짐(HIGH 쪽): 드럼 소리가 더 크게 들어와요.', '꺼짐(LOW 쪽): 드럼 소리가 작게 들어와요. 찌그러지면 이쪽으로.'],
  gn1: ['CH1 GAIN', 'CH1 입력 감도. 들어온 소리를 알맞은 크기로 키워요.', 'CH1 XLR ← DI BOX (베이스·기타)'],
  gn2: ['CH2 GAIN', 'CH2 입력 감도. 들어온 소리를 알맞은 크기로 키워요.', 'CH2 ← DI BOX (통기타)'],
  ce1: ['CH1 COMP/EQ', 'CH1에 컴프레서·EQ 효과를 켜는 스위치.', 'CH1 ← DI BOX (베이스·기타)', '켜짐: 소리 크기 차이를 줄이고 음색이 다듬어져요.', '꺼짐: 원음 그대로예요.'],
  am2: ['CH2 AMP SIM', 'CH2에 기타 앰프 소리를 흉내 내는 효과를 켜는 스위치.', 'CH2 ← DI BOX (통기타)', '켜짐: 앰프를 거친 듯한 음색으로 바뀌어요. 통기타에는 어울리지 않을 수 있어요.', '꺼짐: 원음 그대로예요.'],
  ef1: ['CH1 EFFECT', 'CH1에 내장 이펙트(잔향)를 거는 스위치.', 'CH1 ← DI BOX (베이스·기타)', '켜짐: CH1 소리에 잔향이 더해져요.', '꺼짐: 이펙트가 없어요.'],
  ef2: ['CH2 EFFECT', 'CH2에 내장 이펙트(잔향)를 거는 스위치.', 'CH2 ← DI BOX (통기타)', '켜짐: CH2 소리에 잔향이 더해져요.', '꺼짐: 이펙트가 없어요.'],
  lv1: ['CH1 MIC 레벨', 'CH1 음량. DI BOX(베이스·기타) 소리가 AG06 출력에서 차지하는 크기.', 'CH1 ← DI BOX (베이스·기타) → STEREO OUT → DFX-12 9/10'],
  lv2: ['CH2 MIC/GTR 레벨', 'CH2 음량. DI BOX(통기타) 소리가 AG06 출력에서 차지하는 크기.', 'CH2 ← DI BOX (통기타) → STEREO OUT → DFX-12 9/10'],
  lv34: ['3/4 키보드 레벨', '3/4 입력 음량. 키보드(피아노) 소리가 AG06 출력에서 차지하는 크기.', '3/4 L/MONO·R ← 키보드 → STEREO OUT → DFX-12 9/10'],
  lv56: ['5/6 드럼 레벨', '5/6 입력 음량. 드럼 소리가 AG06 출력에서 차지하는 크기.', '5/6 RCA L·R ← 드럼 (TS 모노 ×2 → RCA) → STEREO OUT → DFX-12 9/10'],
  lvu: ['USB 레벨', 'PC 등에서 USB로 들어오는 재생음의 크기.', 'USB 입력 (지금은 사용 안 함)'],
  lb: ['LOOPBACK', 'USB로 PC에 보내는 소리에 PC 재생음을 섞는 스위치.', 'USB 출력 (PC)', '켜짐: PC로 가는 소리에 재생음까지 함께 들어가요. 교회 스피커 소리에는 영향이 없어요.', '꺼짐: 녹음·방송용 소리에 재생음이 섞이지 않아요.'],
  mm: ['MONITOR MUTE', 'MON OUT과 헤드폰 쪽 소리를 끄는 스위치.', 'MON OUT L·R / PHONES', '켜짐: 모니터 출력이 꺼져요. DFX-12로 가는 STEREO OUT 소리는 그대로예요.', '꺼짐: 모니터 출력이 나와요.'],
  msp: ['MONITOR SPEAKER 레벨', 'MON OUT 잭(모니터 스피커용) 출력 음량.', 'MON OUT L·R (지금은 비어 있음)'],
  mph: ['MONITOR PHONES 레벨', '헤드폰 출력 음량.', 'PHONES (지금은 비어 있음)']
};
const AGCH = { gn1: 'DI BOX(베이스·기타) 소리', gn2: 'DI BOX(통기타) 소리', lv1: 'CH1(베이스·기타)', lv2: 'CH2(통기타)', lv34: '키보드', lv56: '드럼', lvu: 'USB 재생음', msp: '모니터 출력', mph: '헤드폰 출력' };
const explain = (d, v, f) => {
  const a = A[d.id];
  if (!a) return { title: d.name, desc: d.name, src: '-', eff: '-' };
  let eff;
  if (d.type === 'button') eff = v === 1 ? a[3] : a[4];
  else if (d.id === 'lvu' || d.id === 'msp' || d.id === 'mph') eff = effOf(d, v, f, AGCH[d.id], null) + (d.id === 'lvu' ? '' : ' 지금은 연결된 기기가 없어 들리는 변화는 없어요.');
  else eff = effOf(d, v, f, AGCH[d.id], d.kind === 'level' ? { lv: 'STEREO OUT으로 나가 DFX-12 9/10 채널에서 한 번 더 조절돼요.' } : null);
  return { title: a[0], desc: a[0] + '. ' + a[1], src: a[2], eff: eff };
};
const infoOf = (d, v, f) => explain(d, v, f);
const nmAg = { ph: '+48V', pad1: 'PAD', gtr: 'GUITAR', pad2: 'PAD', gh34: 'GAIN H/L', gh56: 'GAIN H/L', gn1: 'GAIN', gn2: 'GAIN', ce1: 'COMP/EQ', am2: 'AMP SIM', ef1: 'EFFECT', ef2: 'EFFECT', lv1: 'CH1 MIC', lv2: 'CH2 MIC/GTR', lv34: '3/4 KEYBD', lv56: '5/6 DRUM', lvu: 'USB', lb: 'LOOPBACK', mm: 'MONITOR MUTE', msp: 'MONITOR SPKR', mph: 'MONITOR PHONES' };
const nameList = defs.map((d) => (d.type === 'knob' ? { x: d.x, y: d.y + d.r + 11, t: nmAg[d.id] || d.name, fs: 11 } : { x: d.x, y: d.y + d.h / 2 + 13, t: nmAg[d.id] || d.name, fs: 11 }));
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
const shut = (patch) => { self.setState({ closing: true }); clearTimeout(self.__ct); self.__ct = setTimeout(() => self.setState(Object.assign({ closing: false }, patch)), 220); };
return {
sheetAnim: self.state.closing ? 'sheetDown .22s ease-in forwards' : 'sheetUp .28s cubic-bezier(.2,.8,.2,1)', dimAnim: self.state.closing ? 'dimOut .22s ease-in forwards' : 'dimIn .2s ease-out', bgTap: (e) => { const t = e && e.target; if (!(t && t.closest && t.closest('[role="button"],button,a'))) shut({ open: false }); }, inspOpen: !!this.state.open, inspClosed: !this.state.open, hideInsp: () => shut({ open: false }), showInsp: () => this.setState({ open: true }),
pw: Math.round(560 * (self.state.z || 1)), ph: Math.round(819 * (self.state.z || 1)), zIn: () => self.setState({ z: Math.min(3, (self.state.z || 1) + 0.5) }), zOut: () => self.setState({ z: Math.max(0.5, (self.state.z || 1) - 0.25) }), chips: chips, secLabel: chips[(self.state.sec || 0)].label, secPos: ((self.state.sec || 0) + 1) + ' / ' + chips.length, ddAny: !!self.state.dd, ddDevOpen: self.state.dd === 'dev', ddSecOpen: self.state.dd === 'sec', ddDevRot: self.state.dd === 'dev' ? 'rotate(180deg)' : 'none', ddSecRot: self.state.dd === 'sec' ? 'rotate(180deg)' : 'none', ddDev: () => self.setState({ dd: self.state.dd === 'dev' ? null : 'dev' }), ddSec: () => self.setState({ dd: self.state.dd === 'sec' ? null : 'sec' }), ddClose: () => self.setState({ dd: null }), secItems: chips.map((c, k) => ({ label: c.label, fw: k === (self.state.sec || 0) ? 600 : 400, op: k === (self.state.sec || 0) ? 1 : 0, bt: k ? '0.5px solid var(--sep)' : '0', pick: () => { self.setState({ sec: k, dd: null }); c.go(); } })), secPrev: () => { const k = ((self.state.sec || 0) + chips.length - 1) % chips.length; self.setState({ sec: k }); chips[k].go(); }, secNext: () => { const k = ((self.state.sec || 0) + 1) % chips.length; self.setState({ sec: k }); chips[k].go(); }, names: nameList, selInfo: info, more: s.more, toggleMore: () => self.setState({ more: !self.state.more }), moreLabel: s.more ? '설명 접기' : '설명 보기', aPh: s.vals.ph === 1 ? 1 : 0,
flowD: fv.d, flowDots: fv.dots, flowArrow: fv.arrow, flowText: fv.text, hasFlow: !!fv.text, knobs: knobs, buttons: buttons, texts: [], lamps: lamps, jacks: jacks, pins: pins, textsBake: texts,
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
const nv = Number(e.target.value) / 100;
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
