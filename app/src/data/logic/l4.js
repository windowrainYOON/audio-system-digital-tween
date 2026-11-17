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
this.state = { more: false, sel: 'g1', vals: vals, synced: {}, phantom: false, power: true };
const __raw = this.setState.bind(this); this.__raw = __raw; this.__cur = { vals: this.state.vals, synced: this.state.synced, phantom: this.state.phantom };
this.setState = (o, cb) => { __raw(o, cb); if (o && typeof o === 'object' && (o.vals || o.synced || o.phantom !== undefined)) { this.__cur = { vals: o.vals || this.__cur.vals, synced: o.synced || this.__cur.synced, phantom: o.phantom !== undefined ? o.phantom : this.__cur.phantom }; if (this.__save) this.__save(); } };
}
defs() {
const K = '#1a1a1a', W = '#f5f5f5', Y = '#f2c200', R = '#e0332b';
const k = (id, name, label, x, y, cap, kind, def) => ({ id: id, name: name, label: label, x: x, y: y, cap: cap, kind: kind, def: def, type: 'knob' });
const eqf = ['63', '160', '400', '1K', '2.5K', '6.3K', '16K'];
const out = [
k('g1', 'CH1 GAIN', 'GAIN', 210, 540, K, 'gain', 0.4), k('g2', 'CH2 GAIN', 'GAIN', 298, 540, K, 'gain', 0.4),
k('h1', 'CH1 HIGH', 'HIGH', 210, 602, W, 'tone', 0.5), k('h2', 'CH2 HIGH', 'HIGH', 298, 602, W, 'tone', 0.5),
k('l1', 'CH1 LOW', 'LOW', 210, 662, W, 'tone', 0.5), k('l2', 'CH2 LOW', 'LOW', 298, 662, W, 'tone', 0.5),
k('e1', 'CH1 EFF', 'EFF', 210, 722, Y, 'level', 0), k('e2', 'CH2 EFF', 'EFF', 298, 722, Y, 'level', 0),
k('v1', 'CH1 LEVEL', 'LEVEL 1', 210, 787, R, 'level', 0.6), k('v2', 'CH2 LEVEL', 'LEVEL 2', 298, 787, R, 'level', 0.6),
k('v34', 'CH3/4 LEVEL', '3/4', 388, 540, R, 'level', 0.6), k('usb', 'USB VOL', 'USB VOL', 388, 602, R, 'level', 0.5),
k('ret', 'RETURN', 'RETURN', 388, 662, Y, 'level', 0), k('echo', 'ECHO', 'ECHO', 388, 722, Y, 'level', 0),
k('efx', 'EFFECT VOL', 'EFFECT VOL', 388, 787, Y, 'level', 0.5),
k('ml', 'MAIN L', 'L', 480, 787, R, 'level', 0.7), k('mr', 'MAIN R', 'R', 568, 787, R, 'level', 0.7)
];
eqf.forEach((f, i) => { out.push({ id: 'q' + i, name: 'EQ ' + f + ' Hz', label: f, x: 457 + 33.5 * i, y: 0, def: 0.5, kind: 'eq', type: 'fader' }); });
return out;
}
fmt(d, v) {
const ang = -135 + 270 * v;
const h = (12 + ang / 30) % 12;
const hh = Math.floor(h) || 12;
const mm = Math.round((h - Math.floor(h)) * 60);
const hour = d.kind === 'eq' ? '-' : (hh + '시' + (mm ? ' ' + mm + '분' : ''));
const scale = d.kind === 'eq' ? '-' : (v * 10).toFixed(1);
let db = '';
if (d.kind === 'gain') db = '라인 ' + (-6 + 44 * v).toFixed(0) + ' dB / 마이크 ' + (20 + 44 * v).toFixed(0) + ' dB';
else if (d.kind === 'tone') db = (-15 + 30 * v).toFixed(0) + ' dB';
else if (d.kind === 'eq') db = (-12 + 24 * v).toFixed(0) + ' dB';
else db = v < 0.03 ? '-∞ (뮤트와 같음)' : '약 ' + ((v * 10 - 7) * 4).toFixed(0) + ' dB (눈금 7이 0 dB 근처)';
return { hour: hour, scale: scale, db: db };
}
nameOf(d) {
const m = { ml: 'MAIN L', mr: 'MAIN R', v34: '3/4 LEVEL', usb: 'USB VOL', efx: 'EFFECT VOL' };
return { x: d.x, y: d.y + 28, t: m[d.id] || d.label, fs: 11 };
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
const O = [[465, 362, 25], [465, 410, 25]];
const T = ' → MAIN OUT L·R → DFX-12 CD/TAPE IN';
return [
{ ids: ['g1', 'h1', 'l1', 'e1', 'v1'], x: 212, y0: 458, y1: 825, jacks: [[214, 458, 24]], outs: O, txt: 'CD L → CH1 LINE 단자 → GAIN → HIGH·LOW → EFF → LEVEL 1' + T },
{ ids: ['g2', 'h2', 'l2', 'e2', 'v2'], x: 298, y0: 458, y1: 825, jacks: [[300, 458, 24]], outs: O, txt: 'CD R → CH2 LINE 단자 → GAIN → HIGH·LOW → EFF → LEVEL 2' + T },
{ ids: ['v34'], x: 388, y0: 358, y1: 568, jacks: [[385, 358, 19], [385, 402, 19]], outs: O, txt: 'PC AUX→RCA → CH3/4 TAPE L·R 단자 → 3/4 LEVEL' + T },
{ ids: ['usb'], x: 388, y0: 584, y1: 622, outs: O, txt: 'USB 플레이어 → USB VOL' + T },
{ ids: ['ret', 'echo', 'efx'], x: 388, y0: 640, y1: 812, outs: O, txt: '내장 이펙트: CH1·2 EFF 보내기 → RETURN·ECHO → EFFECT VOL' + T },
{ ids: ['ml'], x: 480, y0: 770, y1: 825, outs: [[465, 362, 25]], txt: '왼쪽 믹스 → MAIN L → MAIN OUT L 단자 → DFX-12 CD/TAPE IN L' },
{ ids: ['mr'], x: 568, y0: 770, y1: 825, outs: [[465, 410, 25]], txt: '오른쪽 믹스 → MAIN R → MAIN OUT R 단자 → DFX-12 CD/TAPE IN R' }
];
}

renderVals() {
const s = this.state;
const defs = this.defs();
const self = this;
const sel = defs.filter((d) => d.id === s.sel)[0];
const fv = this.flowOf(s.sel, defs);
const v = s.vals[s.sel];
const f = this.fmt(sel, v);
const synced = s.synced[s.sel] !== false;
const knobs = defs.filter((d) => d.type === 'knob').map((d) => {
const val = s.vals[d.id];
const ang = -135 + 270 * val;
const rad = (ang - 90) * Math.PI / 180;
return { id: d.id,
x: d.x, y: d.y, cap: d.cap, label: d.label, name: d.name,
ptr: d.cap === '#1a1a1a' ? '#ffffff' : '#111111',
tf: 'translate(' + d.x + ',' + d.y + ') rotate(' + ang + ')',
ring: d.id === s.sel ? '#2DD4BF' : 'transparent',
ly: d.y - 24,
dx: d.x + 17 * Math.cos(rad), dy: d.y + 17 * Math.sin(rad),
dotOp: s.synced[d.id] === false ? 1 : 0,
nmx: self.nameOf(d).x, nmy: self.nameOf(d).y, nmf: self.nameOf(d).fs, nm: self.nameOf(d).t, pick: () => self.setState({ sel: d.id })
};
});
const faders = defs.filter((d) => d.type === 'fader').map((d) => {
const val = s.vals[d.id];
return { id: d.id,
tx: d.x - 2, hx: d.x - 10, cx: d.x, hy: 566 + (1 - val) * 100, label: d.label, name: d.name,
ring: d.id === s.sel ? '#2DD4BF' : '#777',
nmx: self.nameOf(d).x, nmy: self.nameOf(d).y, nmf: self.nameOf(d).fs, nm: self.nameOf(d).t, pick: () => self.setState({ sel: d.id })
};
});
const jumpTo = (x, y) => () => { const el = document.getElementById('pan'); if (el) el.scrollTo({ left: Math.max(0, (x - 100.0) * 0.8 - 12), top: Math.max(0, (y - 150.0) * 0.8 - 12), behavior: 'smooth' }); };
const chips = [["CH1·2 입력", 100, 150], ["CH1·2 노브", 100, 500], ["3/4·팬텀", 330, 320], ["MAIN OUT", 440, 320], ["EQ·미터", 440, 520]].map((c) => ({ label: c[0], go: jumpTo(c[1], c[2]) }));

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

const L4K = (id) => (id.charAt(0) === 'q' ? 'q' : (/^[ghlev][12]$/.test(id) ? id.charAt(0) : id));
const L4S = (id) => (/2$/.test(id) && id !== 'v34' ? 'CD 오른쪽' : 'CD 왼쪽');
const L4I = {
  g: ['입력 감도(GAIN)', '잭으로 들어온 소리를 믹서가 다루기 좋은 크기로 키우는 첫 단계'],
  h: ['고음(HIGH) 조절', '음색에서 밝고 또렷한 고음 부분을 키우거나 줄임'],
  l: ['저음(LOW) 조절', '음색에서 묵직한 저음 부분을 키우거나 줄임'],
  e: ['이펙트 보내기(EFF)', '이 채널 소리를 내장 이펙트로 얼마나 보낼지 정함'],
  v: ['채널 음량(LEVEL)', '이 채널 소리가 L4 믹스에서 차지하는 크기'],
  v34: ['3/4 채널 음량', '3/4 스테레오 입력(PC) 소리의 크기'],
  usb: ['USB 재생 음량', 'L4 자체 USB 플레이어로 재생하는 음악의 크기'],
  ret: ['이펙트 리턴(RETURN)', '이펙트가 만든 소리를 믹스로 되돌리는 양'],
  echo: ['에코(ECHO) 양', '에코(메아리) 효과의 양'],
  efx: ['이펙트 음량(EFFECT VOL)', '내장 이펙트 소리 전체의 크기'],
  ml: ['메인 출력 왼쪽(MAIN L)', 'L4가 내보내는 최종 왼쪽 소리의 크기'],
  mr: ['메인 출력 오른쪽(MAIN R)', 'L4가 내보내는 최종 오른쪽 소리의 크기'],
  q: ['그래픽 EQ 대역', '특정 주파수 대역의 소리만 키우거나 줄임']
};
const L4SRC = (id) => {
  const k = L4K(id);
  if (k === 'v34') return 'PC (AUX→RCA, 스테레오)';
  if (k === 'usb') return 'L4 USB 플레이어 (지금은 연결 안 됨)';
  if (k === 'ret' || k === 'echo' || k === 'efx') return 'CD·PC에서 이펙트로 보낸 소리';
  if (k === 'ml') return 'CD·PC 전체의 왼쪽 → DFX-12 CD/TAPE IN L';
  if (k === 'mr') return 'CD·PC 전체의 오른쪽 → DFX-12 CD/TAPE IN R';
  if (k === 'q') return 'CD·PC 전체 출력 (MAIN OUT에 적용)';
  return L4S(id) + ' (CH' + id.charAt(1) + ', RCA→TS 어댑터)';
};
const explain = (d, v, f) => {
  const k = L4K(d.id);
  const i = L4I[k];
  const src = k === 'q' ? 'CD·PC 소리' : (k === 'ml' || k === 'mr' ? 'CD·PC 소리' : (k === 'v34' ? 'PC 소리' : (k === 'usb' ? 'USB 음악' : (k === 'ret' || k === 'echo' || k === 'efx' ? '이펙트 소리' : L4S(d.id) + ' 소리'))));
  let eff = effOf(d, v, f, src, { hi: k === 'h' ? '고음' : '저음' });
  if (k === 'e') eff = (v < 0.03 ? '지금 0이라서 이펙트로 보내지 않아요. ' : '지금 ' + (v * 10).toFixed(1) + ' 위치예요. ') + '올리면 ' + src + '에 이펙트(잔향 등)가 더 많이 섞여요. 이펙트 소리는 RETURN·EFFECT VOL로 되돌아와요.';
  return { title: i[0], desc: i[0] + '. ' + i[1] + '.', src: L4SRC(d.id), eff: eff };
};
const infoOf = (d, v, f) => explain(d, v, f);
const shortOf = (d) => ({ ml: 'MAIN L', mr: 'MAIN R', v34: '3/4 LEVEL', usb: 'USB VOL', efx: 'EFFECT VOL' }[d.id] || d.label);
const nameList = defs.filter((d) => d.type === 'knob').map((d) => ({ x: d.x, y: d.y + 28, t: shortOf(d), fs: 11 }));
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
chips: chips, names: nameList, selInfo: info, more: s.more, toggleMore: () => self.setState({ more: !self.state.more }), moreLabel: s.more ? '설명 접기' : '설명 보기', phantomShort: s.phantom ? '+48V ON' : '+48V OFF', aPh: s.phantom ? 1 : 0,
flowD: fv.d, flowDots: fv.dots, flowArrow: fv.arrow, flowText: fv.text, hasFlow: !!fv.text, knobs: knobs, faders: faders,
sel: { isKnob: sel.type === 'knob', isFad: sel.type === 'fader', capc: sel.cap || '#f5f5f7', ptrc: (sel.cap === '#1a1a1a' || sel.cap === '#111' || sel.cap === '#222') ? '#ffffff' : '#111111', dialTf: 'rotate(' + (-135 + 270 * v) + ' 66 66)', fy: 10 + (1 - v) * 136 - 11, fyc: 10 + (1 - v) * 136, name: sel.name, v100: Math.round(v * 100), hour: f.hour, scale: f.scale, db: f.db,
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
markSynced: () => {
const sy = Object.assign({}, self.state.synced);
sy[self.state.sel] = true;
self.setState({ synced: sy });
},
togglePhantom: () => self.setState({ phantom: !self.state.phantom }),
phantomLabel: s.phantom ? '+48V ON (눌러서 끄기)' : '+48V OFF (눌러서 켜기)',
phantomFill: s.phantom ? '#E0332B' : '#5A2A2A',
phantomKnobX: s.phantom ? 389 : 374,
togglePower: () => self.setState({ power: !self.state.power }),
powerLabel: s.power ? '전원 ON' : '전원 OFF',
powerBg: s.power ? '#2DD4BF' : '#5B6168',
powerFg: s.power ? '#0B1F1D' : '#F4F3EE'
};
}
}

export function create() { return new Component({}); }
