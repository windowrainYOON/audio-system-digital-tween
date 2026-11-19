// 자동 생성: tools/extract-profiles.cjs (원본 design/ 시안). 손으로 고치지 마세요.
/* eslint-disable */
// @ts-nocheck
class DCLogic { constructor(p) { this.props = p || {}; this.state = {}; } setState(o) { Object.assign(this.state, o); } }

class Component extends DCLogic {
constructor(props) {
super(props);
const C = (id, grp, from, fromDev, to, type, cls, note) => ({ id: id, grp: grp, from: from, fromDev: fromDev, to: to, type: type, cls: cls, orig: to, note: note || '' });
this.cables = [
C('c1', '강대상 → DFX-12', '강대상1 구즈넥 L', '강대상1', 'dxm1', 'XLR', 'xlr'),
C('c2', '강대상 → DFX-12', '강대상1 구즈넥 R', '강대상1', 'dxm2', 'XLR', 'xlr'),
C('c5', '강대상 → DFX-12', '무선 마이크 수신기', '무선', 'dxm6', 'XLR', 'xlr'),
C('c3', '매립형 → DFX-12', '매립형 XLR 패널 CH1 출력', '매립형 패널', 'dxm3', 'XLR', 'xlr', '배선도에 어느 라인이 기도석인지 없어요. 확인 필요'),
C('c4', '매립형 → DFX-12', '매립형 XLR 패널 CH2 출력', '매립형 패널', 'dxm4', 'XLR', 'xlr', '배선도에 어느 라인이 아래강대상인지 없어요. 확인 필요'),
C('c22', '매립형 → DFX-12', '매립형 XLR 패널 CH3 출력', '매립형 패널', 'dxm5', 'XLR', 'xlr', '배선도에는 CH5/6에도 매립형 라인이 이어져 있어요. 확인 필요'),
C('c23', '마이크 → 매립형', '기도석 마이크', '기도석', 'wmi1', 'XLR', 'xlr'),
C('c24', '마이크 → 매립형', '아래강대상 마이크', '아래강대상', 'wmi2', 'XLR', 'xlr'),
C('c25', '악기 → DI BOX', '베이스 (HEX B100)', '베이스', 'dii1', '5.5 TS', 'ts'),
C('c26', '악기 → DI BOX', '통기타', '통기타', 'dii2', '5.5 TS', 'ts'),
C('c6', 'DI BOX·키보드·드럼 → AG06', 'DI BOX CH1 출력', 'DI BOX', 'agx1', 'XLR', 'xlr'),
C('c7', 'DI BOX·키보드·드럼 → AG06', 'DI BOX CH2 출력', 'DI BOX', 'agx2', 'XLR', 'xlr'),
C('c8', 'DI BOX·키보드·드럼 → AG06', '키보드 L (TRS→TS 갈래)', '키보드', 'ag3l', '5.5 TS', 'ts'),
C('c9', 'DI BOX·키보드·드럼 → AG06', '키보드 R (TRS→TS 갈래)', '키보드', 'ag3r', '5.5 TS', 'ts'),
C('c10', 'DI BOX·키보드·드럼 → AG06', '전자 드럼 L 출력', '전자 드럼', 'ag5l', 'RCA', 'rca'),
C('c27', 'DI BOX·키보드·드럼 → AG06', '전자 드럼 R 출력', '전자 드럼', 'ag5r', 'RCA', 'rca'),
C('c11', 'AG06 → DFX-12', 'AG06 STEREO OUT L', 'AG06', 'dx9l', '5.5 TS', 'ts'),
C('c12', 'AG06 → DFX-12', 'AG06 STEREO OUT R', 'AG06', 'dx9r', '5.5 TS', 'ts'),
C('c13', 'CD·PC → L4', 'CD L 출력', 'CD', 'l4c1', '5.5 TS', 'ts', 'RCA↔RCA + TS 어댑터'),
C('c14', 'CD·PC → L4', 'CD R 출력', 'CD', 'l4c2', '5.5 TS', 'ts', 'RCA↔RCA + TS 어댑터'),
C('c15', 'CD·PC → L4', 'PC(OBS) 왼쪽', 'PC (OBS)', 'l4tl', 'RCA', 'rca', 'AUX→RCA'),
C('c16', 'CD·PC → L4', 'PC(OBS) 오른쪽', 'PC (OBS)', 'l4tr', 'RCA', 'rca', 'AUX→RCA'),
C('c17', 'L4 → DFX-12', 'L4 MAIN OUT L', 'L4', 'dxtl', 'RCA', 'rca', '5.5 TS→RCA'),
C('c18', 'L4 → DFX-12', 'L4 MAIN OUT R', 'L4', 'dxtr', 'RCA', 'rca', '5.5 TS→RCA'),
C('c19', '앰프', 'DFX-12 MAIN OUT L', 'DFX-12', 'qsl', 'XLR', 'xlr'),
C('c20', '앰프', 'DFX-12 MAIN OUT R', 'DFX-12', 'qsr', 'XLR', 'xlr'),
C('c21', '앰프', 'DFX-12 PHONES', 'DFX-12', 'mps', '5.5 TS', 'ts')
];
const Jk = (id, dev, name, cls) => ({ id: id, dev: dev, name: name, cls: cls });
this.jacks = [
Jk('dxm1', 'Mackie DFX-12', 'CH1 MIC', 'xlr'), Jk('dxm2', 'Mackie DFX-12', 'CH2 MIC', 'xlr'), Jk('dxm3', 'Mackie DFX-12', 'CH3 MIC', 'xlr'), Jk('dxm4', 'Mackie DFX-12', 'CH4 MIC', 'xlr'), Jk('dxm5', 'Mackie DFX-12', 'CH5/6 MIC', 'xlr'), Jk('dxm6', 'Mackie DFX-12', 'CH7/8 MIC', 'xlr'),
Jk('wmi1', '매립형 XLR 패널', 'CH1 입력', 'xlr'), Jk('wmi2', '매립형 XLR 패널', 'CH2 입력', 'xlr'), Jk('wmi3', '매립형 XLR 패널', 'CH3 입력', 'xlr'),
Jk('dii1', 'DI BOX', 'CH1 입력', 'ts'), Jk('dii2', 'DI BOX', 'CH2 입력', 'ts'),
Jk('agx1', 'Yamaha AG06', 'CH1 XLR', 'xlr'), Jk('agx2', 'Yamaha AG06', 'CH2 XLR', 'xlr'),
Jk('l4x1', 'MiCWL L4', 'CH1 XLR', 'xlr'), Jk('l4x2', 'MiCWL L4', 'CH2 XLR', 'xlr'),
Jk('qsl', 'QSC 앰프', '입력 L (XLR)', 'xlr'), Jk('qsr', 'QSC 앰프', '입력 R (XLR)', 'xlr'),
Jk('dx9l', 'Mackie DFX-12', 'CH9/10 L(MONO)', 'ts'), Jk('dx9r', 'Mackie DFX-12', 'CH9/10 R', 'ts'), Jk('dx11l', 'Mackie DFX-12', 'CH11/12 L(MONO)', 'ts'), Jk('dx11r', 'Mackie DFX-12', 'CH11/12 R', 'ts'),
Jk('ag3l', 'Yamaha AG06', '3/4 L/MONO', 'ts'), Jk('ag3r', 'Yamaha AG06', '3/4 R', 'ts'),
Jk('l4c1', 'MiCWL L4', 'CH1 LINE', 'ts'), Jk('l4c2', 'MiCWL L4', 'CH2 LINE', 'ts'),
Jk('mps', 'MPS1200 앰프', '입력 (5.5)', 'ts'),
Jk('ag5l', 'Yamaha AG06', '5/6 L', 'rca'), Jk('ag5r', 'Yamaha AG06', '5/6 R', 'rca'),
Jk('l4tl', 'MiCWL L4', 'TAPE L', 'rca'), Jk('l4tr', 'MiCWL L4', 'TAPE R', 'rca'),
Jk('dxtl', 'Mackie DFX-12', 'CD/TAPE IN L', 'rca'), Jk('dxtr', 'Mackie DFX-12', 'CD/TAPE IN R', 'rca')
];
const S = (conn, g, sig, note) => ({ conn: conn, g: g, sig: sig, note: note || '' });
const XM = S('XLR', '수', '밸런스 모노'), XF = S('XLR', '암', '밸런스 모노');
const TSm = S('5.5mm TS', '수', '모노 (언밸런스)'), RCm = S('RCA', '수', '모노 (언밸런스)');
this.spec = {
c1: [XF, XM], c2: [XF, XM], c3: [XF, XM], c4: [XF, XM], c5: [XF, XM], c22: [XF, XM],
c23: [XF, XM], c24: [XF, XM],
c25: [TSm, TSm], c26: [TSm, TSm],
c6: [XF, XM], c7: [XF, XM],
c8: [S('5.5mm TS (키보드 Y케이블 한 갈래)', '수', '모노 (언밸런스)', '키보드 TRS 출력을 Y케이블(TS 2개)로 갈라 AG06 3/4 L·R에 꽂아요.'), TSm],
c9: [S('5.5mm TS (키보드 Y케이블 한 갈래)', '수', '모노 (언밸런스)', '키보드 TRS 출력을 Y케이블(TS 2개)로 갈라 AG06 3/4 L·R에 꽂아요.'), TSm],
c10: [S('5.5mm TS (드럼 L 출력)', '수', '모노 (언밸런스)', '드럼 L 출력 단자에서 TS→RCA로 바꿔 AG06 5/6 L에 꽂아요.'), RCm], c27: [S('5.5mm TS (드럼 R 출력)', '수', '모노 (언밸런스)', '드럼 R 출력 단자에서 TS→RCA로 바꿔 AG06 5/6 R에 꽂아요.'), RCm], c11: [TSm, TSm], c12: [TSm, TSm],
c13: [S('RCA (CD L 출력)', '수', '모노 (언밸런스)'), S('5.5mm TS (RCA→TS 어댑터 끝)', '수', '모노 (언밸런스)', 'RCA↔RCA 케이블 끝에 RCA 암→5.5 TS 수 어댑터를 끼운 구성이에요.')],
c14: [S('RCA (CD R 출력)', '수', '모노 (언밸런스)'), S('5.5mm TS (RCA→TS 어댑터 끝)', '수', '모노 (언밸런스)', 'RCA↔RCA 케이블 끝에 RCA 암→5.5 TS 수 어댑터를 끼운 구성이에요.')],
c15: [S('3.5mm TRS (AUX)', '수', '스테레오 (L+R 한 선, RCA 적·백으로 분기)', 'L/R 두 줄이 한 케이블에서 갈라져요.'), RCm],
c16: [S('3.5mm TRS (AUX)', '수', '스테레오 (L+R 한 선, RCA 적·백으로 분기)', 'L/R 두 줄이 한 케이블에서 갈라져요.'), RCm],
c17: [TSm, RCm], c18: [TSm, RCm],
c19: [XF, XM], c20: [XF, XM],
c21: [S('5.5mm TS', '수', '모노 (언밸런스)', 'PHONES 잭은 스테레오라서 TS 플러그를 꽂으면 한쪽 채널만 나올 수 있어요. 소리가 약하면 확인해 보세요.'), TSm]
};
this.jackKind = { xlr: 'XLR', ts: '5.5mm 단자', rca: 'RCA 단자' };
const cur = {};
this.cables.forEach((c) => { cur[c.id] = c.to; });
this.pairC = { c8: 'c9', c9: 'c8', c10: 'c27', c27: 'c10', c11: 'c12', c12: 'c11', c13: 'c14', c14: 'c13', c15: 'c16', c16: 'c15', c17: 'c18', c18: 'c17', c19: 'c20', c20: 'c19' };
this.pairJ = { dx9l: 'dx9r', dx9r: 'dx9l', dx11l: 'dx11r', dx11r: 'dx11l', ag3l: 'ag3r', ag3r: 'ag3l', l4c1: 'l4c2', l4c2: 'l4c1', l4tl: 'l4tr', l4tr: 'l4tl', dxtl: 'dxtr', dxtr: 'dxtl', qsl: 'qsr', qsr: 'qsl', ag5l: 'ag5r', ag5r: 'ag5l' };
this.advice = { 'rca>ts': 'RCA 암→5.5 TS 수 어댑터가 필요해요.', 'ts>rca': '5.5 TS 수→RCA 수 변환 케이블이 필요해요.', 'xlr>ts': 'XLR→5.5 TS 변환 케이블이 필요해요. 밸런스가 언밸런스로 바뀌어요.', 'ts>xlr': '언밸런스 신호를 XLR로 받으려면 DI BOX를 쓰는 게 안전해요.', 'rca>xlr': 'DI BOX를 거쳐서 연결하는 게 안전해요.', 'xlr>rca': '변환 케이블이 필요해요. 권장하지 않아요.' };
let hist0 = [], savedAt = '', ap0 = true, ack0 = '', ackCur0 = null;
try { const raw = window.localStorage.getItem('twin.wiring.v2'); if (raw) { const o = JSON.parse(raw); Object.keys(o.cur || {}).forEach((k) => { if (cur[k] !== undefined && (o.cur[k] === null || this.jacks.filter((j) => j.id === o.cur[k]).length)) cur[k] = o.cur[k]; }); if (o.ap === false) ap0 = false; if (typeof o.ack === 'string') ack0 = o.ack; if (o.ackCur) ackCur0 = o.ackCur; savedAt = o.at || ''; } } catch (e) {}
this.state = { ack: ack0, ackCur: ackCur0, ap: ap0, cur: cur, sel: null, draft: null, tab: 'cable', jsel: null, hist: hist0, savedAt: savedAt, ask: null, toast: '' };
}
jk(id) { return this.jacks.filter((j) => j.id === id)[0] || { id: null, dev: '', name: '연결 안 됨', cls: '' }; }
persist(cur, ap) {
const d = new Date();
const at = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2);
try { window.localStorage.setItem('twin.wiring.v2', JSON.stringify({ cur: cur, at: at, ap: ap === undefined ? this.state.ap !== false : ap, ack: this.state.ack || '', ackCur: this.state.ackCur || null, chg: this.chgList(cur), sig: this.changeSig(cur) })); } catch (e) {}
return at;
}
commit(next, extra) {
const s = this.state;
const at = this.persist(next);
const hist = s.hist.concat([s.cur]).slice(-20);
this.setState(Object.assign({ cur: next, hist: hist, savedAt: at }, extra || {}));
}
move(cid, jid, withPartner) {
const s = this.state;
const next = Object.assign({}, s.cur);
const old = next[cid];
const occ = this.cables.filter((x) => x.id !== cid && next[x.id] === jid)[0];
if (occ) next[occ.id] = null;
next[cid] = jid;
if (withPartner) {
const pc = this.pairC[cid], pj = this.pairJ[jid];
if (pc && pj && !this.cables.filter((x) => x.id !== pc && x.id !== cid && next[x.id] === pj).length) next[pc] = pj;
}
return next;
}
// 2026-11-18 사용자 결정: 확인(점검 탭 또는 이 카드)하면 실물에도 똑같이 옮긴 것으로 보고 그때 배선(ackCur)을 기준으로 삼는다.
// chgList: 기준과 다른 케이블 목록(점검 탭 '배선 변경' 항목이 그대로 보여 준다)
chgList(cur) { const b = this.state && this.state.ackCur; return this.cables.filter((c) => cur[c.id] !== (b && b[c.id] !== undefined ? b[c.id] : c.orig)).map((c) => { const f = b && b[c.id] !== undefined ? b[c.id] : c.orig; const a = this.jk(f), z = this.jk(cur[c.id]); return { id: c.id, name: c.from, from: f ? a.dev + ' ' + a.name : '연결 안 됨', to: cur[c.id] ? z.dev + ' ' + z.name : '연결 안 됨' }; }); }
changeSig(cur) { return this.cables.filter((c) => cur[c.id] !== c.orig).map((c) => c.id + '=' + cur[c.id]).join(','); }
lab(id) { if (!id) return '뽑혀 있음 (연결 안 됨)'; const j = this.jk(id); return j.dev + ' ' + j.name; }
renderVals() {
const s = this.state;
const self = this;
const colors = { xlr: '#1d1d1f', ts: '#6e6e73', rca: '#ff383c' };
const chipBgs = { xlr: '#78788033', ts: '#78788033', rca: '#ff383c29' };
const jlab = (id) => self.lab(id);
let changeCount = 0;
this.cables.forEach((c) => { if (s.cur[c.id] !== c.orig) changeCount++; });
const order = [];
this.cables.forEach((c) => { if (order.indexOf(c.grp) < 0) order.push(c.grp); });
const groups = order.map((g) => ({
title: g,
rows: this.cables.filter((c) => c.grp === g).map((c, i) => {
const changed = s.cur[c.id] !== c.orig;
const sp = self.spec[c.id]; return { spec: sp[0].conn.split(' (')[0] + ' ' + sp[0].g + '놈 → ' + sp[1].conn.split(' (')[0] + ' ' + sp[1].g + '놈 · ' + (sp[0].sig.indexOf('스테레오') === 0 ? '스테레오' : sp[0].sig.split(' (')[0]), from: c.from, to: self.lab(s.cur[c.id]), dot: colors[c.cls], chip: !s.cur[c.id] ? '뽑힘' : (changed ? '변경됨' : c.type), chipBg: changed ? '#ff8d2829' : chipBgs[c.cls], bg: 'transparent', bt: i === 0 ? 'none' : '0.5px solid rgba(60,60,67,0.29)', pick: () => self.setState({ sel: c.id, draft: s.cur[c.id], closing: false }) };
})
}));
let dia = { note: '', alt: '', fromDev: '', fromJack: '', toDev: '', toJack: '', type: '', color: '#6e6e73', toFill: '#f5f5f7', toStroke: '#8e8e93', changed: false, was: '', warn: false, warnText: '' };
let opts = [];
let jgroups = [];
let jt = { title: '', now: '', kind: '', hasInfo: false, info: '' };
let jopts = [];
const jopen = !!s.jsel;
let ends = [];
let rec = { show: false, text: '', go: () => {} };
const open = !!s.sel;
if (open) {
const c = this.cables.filter((x) => x.id === s.sel)[0];
const d = this.jk(s.cur[c.id]);
const o = this.jk(c.orig);
const changed = s.cur[c.id] !== c.orig;
dia = { alt: c.from + '에서 ' + d.dev + ' ' + d.name + '로 연결', fromDev: c.fromDev, fromJack: c.from.indexOf('(') > 0 ? c.from.split(' (')[0] : '출력', toDev: d.dev.replace('Mackie ', '').replace('Yamaha ', '').replace('MiCWL ', ''), toJack: d.name, type: c.type, color: colors[c.cls], toFill: changed ? '#0066cc1f' : '#f5f5f7', toStroke: changed ? '#0066cc' : '#8e8e93', changed: changed, was: self.lab(c.orig), warn: changed && d.dev !== o.dev, warnText: '다른 장비로 옮기는 변경이에요. 채널 이름과 점검 규칙이 새 연결에 맞춰 다시 계산돼요.' };
const sp = this.spec[c.id];
const pinsOf = (conn, male) => {
const f = male ? '#1d1d1f' : 'none', sw = male ? 1 : 2;
const out = [{ cx: 22, cy: 22, r: 19, fill: 'none', stroke: '#8e8e93', sw: male ? 1.5 : 3 }];
if (conn.indexOf('XLR') === 0) [[22, 12], [13, 28], [31, 28]].forEach((q) => out.push({ cx: q[0], cy: q[1], r: 4, fill: f, stroke: '#1d1d1f', sw: sw }));
else if (conn.indexOf('RCA') === 0) out.push({ cx: 22, cy: 22, r: 6, fill: f, stroke: '#1d1d1f', sw: sw });
else if (conn.indexOf('3.5mm TRS') === 0 || conn.indexOf('5.5mm TRS') === 0) { out.push({ cx: 22, cy: 22, r: 13, fill: 'none', stroke: '#1d1d1f', sw: sw }); out.push({ cx: 22, cy: 22, r: 8, fill: 'none', stroke: '#1d1d1f', sw: sw }); out.push({ cx: 22, cy: 22, r: 3, fill: f, stroke: '#1d1d1f', sw: sw }); }
else { out.push({ cx: 22, cy: 22, r: 11, fill: 'none', stroke: '#1d1d1f', sw: sw }); out.push({ cx: 22, cy: 22, r: 4, fill: f, stroke: '#1d1d1f', sw: sw }); }
return out;
};
const mkEnd = (e, where, jackDesc) => ({ where: where, conn: e.conn, g: e.g === '수' ? '숫놈' : '암놈', gBg: e.g === '수' ? '#0066cc22' : '#ff8d2833', sig: e.sig, jack: jackDesc + ': ' + (e.g === '수' ? '암놈(구멍)' : '숫놈(핀)'), pins: pinsOf(e.conn, e.g === '수') });
ends = [mkEnd(sp[0], '시작 끝 · ' + c.fromDev + ' 쪽', c.fromDev + ' 출력 단자'), mkEnd(sp[1], '도착 끝 · ' + d.dev.replace('Mackie ', '').replace('Yamaha ', '').replace('MiCWL ', '') + ' 쪽', d.name + ' 입력 단자')];
dia.note = [sp[0].note, sp[1].note].filter((x) => x).join(' / ');
const curJ = this.jk(s.cur[c.id]);
const pcid = this.pairC[c.id], pj = this.pairJ[s.cur[c.id]];
if (pcid && pj && s.cur[pcid] !== pj && this.jk(pj).cls === c.cls && !this.cables.filter((x) => x.id !== pcid && x.id !== c.id && s.cur[x.id] === pj).length) {
const pcab = this.cables.filter((x) => x.id === pcid)[0];
rec = { show: true, text: pcab.from + ' 선도 ' + jlab(pj) + '로 옮기면 L·R 짝이 맞아요.', go: () => { const nx = Object.assign({}, self.state.cur); nx[pcid] = pj; self.commit(nx, {}); } };
}
const devs = [];
this.jacks.forEach((j) => { if (devs.indexOf(j.dev) < 0) devs.push(j.dev); });
// 2026-11-18 사용자 결정: 꽂을 수 있는 모든 입력 단자를 보여 주고, 종류가 다른 단자는 고를 때 알림 팝업을 한 번만 띄운다
opts = devs.map((dv) => ({
dev: dv,
// 2026-11-19 사용자 결정: L·R 단자도 한 단자씩 따로 고르고, 케이블도 한 줄씩 따로 옮긴다(짝 선은 아래 추천 카드로만).
items: this.jacks.filter((j) => j.dev === dv).map((j) => {
const diff = j.cls !== c.cls;
const user = this.cables.filter((x) => s.cur[x.id] === j.id && x.id !== c.id)[0];
const dis = false;
const isRec = !dis && !diff && j.id !== s.cur[c.id] && j.dev === curJ.dev && !self.cables.filter((x) => s.cur[x.id] === j.id).length && self.jacks.filter((z) => z.cls === c.cls && z.dev === j.dev && !self.cables.filter((x) => s.cur[x.id] === z.id).length)[0].id === j.id;
if (diff) { const adv = self.advice[c.cls + '>' + j.cls] || '단자 종류가 달라요.'; return { name: j.name, diff: true, kind: '종류 다름 · ' + self.jackKind[j.cls], sub: (user ? '지금 꽂힘: ' + user.from + ' · ' : '') + '어댑터 필요', dis: false, op: 1, ck: 0, pick: () => self.setState({ ask: { cid: c.id, jid: j.id, partner: false, ok: '그래도 꽂기', title: '단자 종류가 달라요', text: c.type + ' 케이블을 ' + j.dev.replace(/^(Mackie|Yamaha|MiCWL) /, '') + ' ' + j.name + '(' + self.jackKind[j.cls] + ')에 꽂으려면: ' + adv + (user ? ' 지금 꽂힌 ' + user.from + '은(는) 뽑혀요.' : ''), toast: c.from + ' → ' + j.name + (user ? ' · ' + user.from + ' 뽑힘' : '') + ' · 어댑터 필요' } }) }; }
return { name: j.name, diff: false, kind: '', sub: user ? '지금 꽂힘: ' + user.from + ' · 고르면 대체돼요' : (j.id === s.cur[c.id] ? '현재 연결' : (isRec ? '추천 · 같은 장비의 빈 단자' : '비어 있음')), dis: false, op: 1, ck: s.cur[c.id] === j.id ? 1 : 0, pick: j.id === s.cur[c.id] ? () => {} : (user ? () => self.setState({ ask: { cid: c.id, jid: j.id, partner: false, ok: '대체', title: j.name + '에 꽂을까요?', text: '지금 꽂힌 ' + user.from + '은(는) 뽑혀요. 실행취소로 되돌릴 수 있어요.', toast: c.from + ' → ' + j.name + ' · ' + user.from + ' 뽑힘' } }) : () => self.commit(self.move(c.id, j.id, false), { draft: j.id })) };
})
}));
}
const jdevs = [];
this.jacks.forEach((j) => { if (jdevs.indexOf(j.dev) < 0) jdevs.push(j.dev); });
const JORD = [['AG06', ['agx1', 'agx2', 'ag3l', 'ag3r', 'ag5l', 'ag5r'], ['c11', 'c12']], ['L4', ['l4x1', 'l4c1', 'l4x2', 'l4c2', 'l4tl', 'l4tr'], ['c17', 'c18']], ['DFX-12', ['dxm1', 'dxm2', 'dxm3', 'dxm4', 'dxm5', 'dxm6', 'dx9l', 'dx9r', 'dx11l', 'dx11r', 'dxtl', 'dxtr'], ['c19', 'c20', 'c21']], ['그 밖의 장비 (매립형 패널 · DI BOX · 앰프)', ['wmi1', 'wmi2', 'wmi3', 'dii1', 'dii2', 'qsl', 'qsr', 'mps'], []]];
const inRow = (jid, i) => { const j = self.jk(jid); const cb = self.cables.filter((x) => s.cur[x.id] === jid)[0]; return { name: (i === 0 && false ? '' : '') + j.name + (JORD[3][1].indexOf(jid) >= 0 ? ' · ' + j.dev : ''), src: cb ? '← ' + cb.from : '비어 있음', srcColor: cb ? 'var(--label2)' : '#8e8e93', bt: i === 0 ? 'none' : '0.5px solid rgba(60,60,67,0.29)', pick: cb ? () => self.setState({ sel: cb.id, draft: s.cur[cb.id] }) : () => self.setState({ jsel: jid }) }; };
const outRow = (cid, i) => { const c = self.cables.filter((x) => x.id === cid)[0]; if (!c) return null; return { name: c.from.replace(/^(AG06|L4|DFX-12) /, '').split(' → ')[0], src: '→ ' + self.lab(s.cur[cid]), srcColor: s.cur[cid] ? 'var(--label2)' : '#d70015', bt: i === 0 ? 'none' : '0.5px solid rgba(60,60,67,0.29)', pick: () => self.setState({ sel: cid, draft: s.cur[cid] }) }; };
jgroups = [];
JORD.forEach((g) => { jgroups.push({ title: g[2].length ? g[0] + ' · 입력' : g[0], rows: g[1].map(inRow) }); const outs = g[2].map(outRow).filter((r) => r); if (outs.length) jgroups.push({ title: g[0] + ' · 출력', rows: outs.map((r, i) => Object.assign(r, { bt: i === 0 ? 'none' : '0.5px solid rgba(60,60,67,0.29)' })) }); });
if (jopen) {
const jj = this.jk(s.jsel);
const cb = this.cables.filter((x) => s.cur[x.id] === s.jsel)[0];
jt = { title: jj.name, now: cb ? cb.from : '비어 있음', kind: jj.dev + ' · ' + this.jackKind[jj.cls], hasInfo: false, info: '' };
jopts = this.cables.map((c, i) => {
const same = c.cls === jj.cls;
const where = jlab(s.cur[c.id]);
const here = s.cur[c.id] === s.jsel;
const occ = cb && cb.id !== c.id;
const from = this.jk(s.cur[c.id]);
const sub = here ? '현재 연결' : (!same ? '어댑터 필요 · ' + (this.advice[c.cls + '>' + jj.cls] || '단자 종류가 달라요.') + (occ ? ' · 고르면 ' + cb.from + ' 대신 꽂혀요' : '') : '지금 ' + where + (c.orig === s.jsel ? ' · 원래 이 단자에 연결하던 소스' : '') + (occ ? ' · 고르면 ' + cb.from + ' 대신 꽂혀요' : ''));
const rec = same && !here && c.orig === s.jsel;
return { name: c.from, sub: sub, bt: i === 0 ? 'none' : '0.5px solid rgba(60,60,67,0.29)', op: 1, tag: rec ? 1 : 0, ck: here ? 1 : 0, pick: here ? () => {} : (!same ? () => self.setState({ ask: { cid: c.id, jid: s.jsel, partner: false, ok: '그래도 꽂기', title: '단자 종류가 달라요', text: c.type + ' 케이블을 ' + jj.name + '(' + self.jackKind[jj.cls] + ')에 꽂으려면: ' + (self.advice[c.cls + '>' + jj.cls] || '단자 종류가 달라요.') + (occ ? ' 지금 꽂힌 ' + cb.from + '은(는) 뽑혀요.' : ''), toast: c.from + ' → ' + jj.name + (occ ? ' · ' + cb.from + ' 뽑힘' : '') + ' · 어댑터 필요' } }) : occ ? () => self.setState({ ask: { cid: c.id, jid: s.jsel, partner: false, ok: '대체', title: jj.name + '에 ' + c.from + '을(를) 꽂을까요?', text: '지금 꽂힌 ' + cb.from + '은(는) 뽑혀요. 실행취소로 되돌릴 수 있어요.', toast: c.from + ' → ' + jj.name + ' · ' + cb.from + ' 뽑힘' } }) : () => { self.commit(self.move(c.id, s.jsel, false), {}); }) };
});
const mover = this.cables.filter((c) => c.cls === jj.cls && s.cur[c.id] !== s.jsel).length;
jt.hasInfo = true; jt.info = '소스를 고르면 바로 저장돼요. 이미 꽂힌 단자에 고르면 확인 후 원래 소스를 뽑고 대체해요. L·R은 한 줄씩 따로 옮겨요. 단자 종류가 다른 소스는 어댑터를 안내해요.';
}
const SRC = [['마이크', [['구즈넥 L', ['c1']], ['구즈넥 R', ['c2']], ['매립형 1 (기도석 마이크)', ['c23', 'c3']], ['매립형 2 (아래강대상 마이크)', ['c24', 'c4']], ['매립형 3', ['c22']], ['무선 마이크', ['c5']]]], ['악기', [['베이스', ['c25', 'c6']], ['기타', ['c26', 'c7']], ['키보드 L', ['c8']], ['키보드 R', ['c9']], ['드럼 L', ['c10']], ['드럼 R', ['c27']]]], ['재생', [['CD L', ['c13']], ['CD R', ['c14']], ['PC (OBS) L', ['c15']], ['PC (OBS) R', ['c16']]]]];
const cab = (id) => self.cables.filter((x) => x.id === id)[0];
const sgroups = SRC.map((g) => ({ title: g[0], rows: g[1].map((r, i) => {
const ids = r[1].filter((id) => cab(id)); const stereo = r[0].indexOf('L·R') > 0; const last = stereo ? ids : ids.slice(-1);
if (!ids.length) return { name: r[0], to: '연결된 케이블이 없어요 (삭제됨)', toColor: '#d70015', chain: '', dot: '#8e8e93', chip: '없음', chipBg: '#ff8d2829', bt: i === 0 ? 'none' : '0.5px solid rgba(60,60,67,0.29)', pick: () => {} };
const main = cab(last[0]); const chg = ids.some((id) => s.cur[id] !== cab(id).orig); const off = last.some((id) => !s.cur[id]);
return { name: r[0], to: last.map((id) => self.lab(s.cur[id])).join(' · '), toColor: off ? '#d70015' : 'var(--label2)',
chain: stereo ? main.type + ' 2줄 (L·R)' : ids.map((id) => cab(id).type).join(' → ') + (ids.length > 1 ? ' (' + self.lab(s.cur[ids[0]]) + ' 경유)' : ''),
dot: colors[main.cls], chip: off ? '뽑힘' : (chg ? '변경됨' : main.type), chipBg: chg || off ? '#ff8d2829' : chipBgs[main.cls], bt: i === 0 ? 'none' : '0.5px solid rgba(60,60,67,0.29)',
pick: () => self.setState({ sel: main.id, draft: s.cur[main.id] }) };
}) }));
const VIEWS = [['cable', '케이블별'], ['src', '소스별'], ['jack', '단자별']];
const shut = (patch) => { self.setState({ closing: true }); clearTimeout(self.__ct); self.__ct = setTimeout(() => self.setState(Object.assign({ closing: false }, patch)), 220); };
return {
sgroups: sgroups, tabSrc: s.tab === 'src',
vchips: VIEWS.map((v) => ({ label: v[1], on: s.tab === v[0] ? 'true' : 'false', bg: s.tab === v[0] ? 'var(--accent)' : 'var(--fill3)', fg: s.tab === v[0] ? '#fff' : 'var(--label)', go: () => self.setState({ tab: v[0] }) })),
askOpen: !!s.ask, ask: s.ask || { title: '', text: '', ok: '대체' }, askNo: () => self.setState({ ask: null }),
askYes: () => { const a = self.state.ask; if (!a) return; self.commit(self.move(a.cid, a.jid, a.partner), { ask: null, draft: self.state.sel ? a.jid : self.state.draft, toast: a.toast }); clearTimeout(self.__tt); self.__tt = setTimeout(() => self.setState({ toast: '' }), 5000); },
toastOpen: !!s.toast, toast: s.toast,
rec: rec, jgroups: jgroups, jt: jt, jopts: jopts, jopen: jopen, tabCable: s.tab === 'cable', tabJack: s.tab === 'jack',
tabCableBg: s.tab === 'cable' ? '#ffffff' : 'transparent', tabJackBg: s.tab === 'jack' ? '#ffffff' : 'transparent',
goCable: () => self.setState({ tab: 'cable' }), goJack: () => self.setState({ tab: 'jack' }),
savedText: s.savedAt ? '자동 저장됨 · ' + s.savedAt : '변경하면 바로 저장돼요',
canUndo: s.hist.length > 0,
undo: () => { self.setState({ toast: '' }); const h = self.state.hist.slice(); const prev = h.pop(); const at = self.persist(prev); self.setState({ cur: prev, hist: h, savedAt: at, draft: self.state.sel ? prev[self.state.sel] : null }); },
jclose: () => shut({ jsel: null }), sheetAnim: s.closing ? 'sheetDown .22s ease-in forwards' : 'sheetUp .28s cubic-bezier(.2,.8,.2,1)', dimAnim: s.closing ? 'dimOut .22s ease-in forwards' : 'dimIn .2s ease-out',
ends: ends, groups: groups, // 2026-11-18 사용자 결정: 노란 변경 알림에 '확인' 버튼. 확인한 변경 묶음(sig)은 다시 알리지 않고, 새로 바꾸면 다시 뜬다
hasChanges: changeCount > 0 && self.changeSig(s.cur) !== s.ack,
ackNow: () => { self.setState({ ack: self.changeSig(self.state.cur), ackCur: Object.assign({}, self.state.cur) }); self.setState({ savedAt: self.persist(self.state.cur) }); },
// 2026-11-18 사용자 결정: 바뀐 연결을 홈 배선도에 실제로 반영할지 배선 탭에서 고른다 (저장 키 twin.wiring.v2의 ap)
apOn: () => { self.setState({ ap: true }); self.setState({ savedAt: self.persist(self.state.cur, true) }); }, apOff: () => { self.setState({ ap: false }); self.setState({ savedAt: self.persist(self.state.cur, false) }); },
apOnP: s.ap !== false ? 'true' : 'false', apOffP: s.ap === false ? 'true' : 'false',
apOnBg: s.ap !== false ? '#fff' : 'transparent', apOffBg: s.ap === false ? '#fff' : 'transparent',
apOnSh: s.ap !== false ? '0 1px 3px rgba(0,0,0,0.15)' : 'none', apOffSh: s.ap === false ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
apText: s.ap !== false ? '홈 배선도도 바뀐 연결로 그려요.' : '홈 배선도는 원래 연결로 그려요. 실물을 옮긴 뒤 반영을 눌러 주세요.', changeCount: changeCount, open: open, dia: dia, opts: opts,
close: () => shut({ sel: null, draft: null }),
apply: () => { const cur = Object.assign({}, self.state.cur); cur[self.state.sel] = self.state.draft; self.setState({ cur: cur, sel: null, draft: null }); },
revert: () => { const c = self.cables.filter((x) => x.id === self.state.sel)[0]; self.commit(self.move(c.id, c.orig, false), { draft: c.orig }); }
};
}
}

export function create() { return new Component({}); }
