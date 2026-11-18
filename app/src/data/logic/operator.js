// 자동 생성: tools/extract-profiles.cjs (원본 design/ 시안). 손으로 고치지 마세요.
/* eslint-disable */
// @ts-nocheck
class DCLogic { constructor(p) { this.props = p || {}; this.state = {}; } setState(o) { Object.assign(this.state, o); } }

class Component extends DCLogic {
constructor(props) {
super(props);
this.state = { g: 'start', st: { start: 2, end: 0 }, src: 0, sst: {}, help: false, closing: false };
}
renderVals() {
const s = this.state;
const self = this;
// controls: [name, kind, value 0..1, text]
const K = (n, v, t) => ({ name: n, knob: true, fader: false, sw: false, rot: 'rotate(' + (-135 + 270 * v) + ' 32 32)', val: t });
const F = (n, v, t) => ({ name: n, knob: false, fader: true, sw: false, fy: 46 - 40 * v, val: t });
const S = (n, on, t) => ({ name: n, knob: false, fader: false, sw: true, swc: on ? '#E0332B' : '#5E6166', swt: on ? 'ON' : 'OFF', val: t });
const G = {
start: { label: '시스템 시작하기', msg: '이제 예배를 시작해도 돼요.', steps: [
['믹서 MAIN을 맨 아래로', 'DFX-12 MAIN L·R 페이더와 L4 MAIN 노브를 맨 아래로 내려요. 켤 때 "펑" 소리를 막아요.', [F('MAIN L·R', 0, '맨 아래 (-∞)'), K('L4 MAIN', 0, '7시 (0)')]],
['안 쓰는 채널 MUTE', 'DFX-12 CH11/12는 비어 있어요. MUTE를 켜고 페이더를 맨 아래로 두세요.', [S('CH11/12 MUTE', true, 'ON'), F('CH11/12 페이더', 0, '맨 아래')]],
['믹서 전원 켜기', 'L4 → AG06 → DFX-12 순서로 켜요. 앰프는 아직 켜지 마세요.', []],
['무선 마이크 켜고 수신기 확인', 'DFX-12 CH7/8 노브를 아래 위치에 맞춰 주세요.', [K('GAIN', 0.39, '11시'), F('페이더', 0.75, 'U 근처')]],
['AG06 건반·드럼 레벨', 'AG06 3/4(키보드)와 5/6(드럼) 레벨을 맞추고, DFX-12 CH9/10 페이더를 U 근처로 올려요.', [K('AG06 3/4·5/6', 0.5, '12시'), F('DFX CH9/10', 0.75, 'U 근처')]],
['앰프 켜고 리허설', '앰프는 마지막에 켜요. QSC → MPS1200을 켠 뒤 MAIN을 천천히 U 근처까지 올려요.', [F('MAIN L·R', 0.75, 'U 근처')]]] },
end: { label: '끝내기', msg: '전원이 모두 꺼졌어요.', steps: [
['MAIN 내리기', 'DFX-12 MAIN L·R 페이더를 맨 아래로 내려요.', [F('MAIN L·R', 0, '맨 아래 (-∞)')]],
['앰프 먼저 끄기', '끌 때는 켤 때의 반대예요. MPS1200 → QSC 앰프를 먼저 꺼요.', []],
['믹서 끄기', 'DFX-12 → AG06 → L4 순서로 꺼요.', []],
['무선 마이크 끄고 충전', '무선 마이크 전원을 끄고 충전기에 꽂아 두세요.', []],
['다음 예배를 위해 확인', '안 쓰는 채널 MUTE와 페이더 위치는 그대로 두면 다음 시작이 쉬워요.', []]] }
};
const SRC = [['구즈넥 L', 'DFX-12', 'CH1', 'mic'], ['구즈넥 R', 'DFX-12', 'CH2', 'mic'], ['매립형 1', 'DFX-12', 'CH3', 'mic'], ['매립형 2', 'DFX-12', 'CH4', 'mic'], ['매립형 3', 'DFX-12', 'CH5/6', 'mic'], ['무선 마이크', 'DFX-12', 'CH7/8', 'mic'], ['베이스', 'AG06', 'CH1', 'di'], ['기타', 'AG06', 'CH2', 'di'], ['키보드', 'AG06', 'CH3/4', 'line'], ['드럼', 'AG06', 'CH5/6', 'line'], ['CD', 'L4', 'CH1/2', 'l4'], ['PC (OBS)', 'L4', 'CH3/4', 'l4']];
const sv = SRC[s.src];
const route = sv[1] === 'DFX-12' ? '' : (sv[1] === 'AG06' ? ' AG06 소리는 DFX-12 CH9/10으로 들어가요.' : ' L4 소리는 DFX-12 CD/TAPE IN으로 들어가요.');
const lvl = sv[3] === 'l4' ? K(sv[2] === 'CH3/4' ? '3/4 LEVEL' : 'LEVEL', 0.65, '눈금 6.5') : F(sv[2] + ' 페이더', 0.75, 'U 근처');
const srcSteps = [
['페이더(레벨) 맨 아래로', sv[1] + ' ' + sv[2] + ' 페이더나 LEVEL을 먼저 맨 아래로 내려요.', [sv[3] === 'l4' ? K('LEVEL', 0, '맨 아래') : F(sv[2] + ' 페이더', 0, '맨 아래')]],
['GAIN 맞추기', sv[0] + '를 평소 크기로 소리 내며 ' + sv[1] + ' ' + sv[2] + ' GAIN을 올려요. PEAK 램프가 가끔만 깜빡이면 알맞아요.', [K('GAIN', sv[3] === 'mic' ? 0.5 : 0.39, sv[3] === 'mic' ? '12시 근처에서 시작' : '11시 근처에서 시작')]],
['레벨 올리기', '소리를 들으며 레벨을 천천히 올려요.' + route, [lvl]],
['소리 확인', '메인 스피커 L·R 양쪽에서 들리는지 확인해요.', []]];
const g = s.g === 'src' ? { label: '소스별 소리 조정하기', msg: sv[0] + ' 소리를 맞췄어요.', steps: srcSteps } : G[s.g];
const idx = s.g === 'src' ? (s.sst[s.src] || 0) : s.st[s.g];
const setIdx = (k) => { if (self.state.g === 'src') { const o = Object.assign({}, self.state.sst); o[self.state.src] = k; self.setState({ sst: o }); } else { const o = Object.assign({}, self.state.st); o[self.state.g] = k; self.setState({ st: o }); } };
const N = g.steps.length;
const shut = (patch) => { self.setState({ closing: true }); clearTimeout(self.__ct); self.__ct = setTimeout(() => self.setState(Object.assign({ closing: false }, patch)), 220); };
const now = idx < N ? { n: idx + 1, t: g.steps[idx][0], d: g.steps[idx][1], ctl: g.steps[idx][2], hasCtl: g.steps[idx][2].length > 0 } : { n: 0, t: '', d: '', ctl: [], hasCtl: false };
return {
gchips: [['start', '시스템 시작하기'], ['end', '끝내기'], ['src', '소스별 소리 조정']].map((c) => ({ label: c[1], on: s.g === c[0] ? 'true' : 'false', bg: s.g === c[0] ? 'var(--accent)' : 'var(--fill3)', fg: s.g === c[0] ? '#fff' : 'var(--label)', go: () => self.setState({ g: c[0] }) })),
isSrc: s.g === 'src', srcName: sv[0] + ' → ' + sv[1] + ' ' + sv[2], srcPos: (s.src + 1) + ' / ' + SRC.length,
ddOpen: !!s.dd, ddRot: s.dd ? 'rotate(180deg)' : 'none', ddSrc: () => self.setState({ dd: !self.state.dd }), ddClose: () => self.setState({ dd: false }), srcItems: (() => { const out = []; const H = { mic: '마이크', di: '악기', line: '악기', l4: '재생' }; let last = ''; SRC.forEach((v, k) => { const h = H[v[3]] || '기타'; if (h !== last) { out.push({ head: true, row: false, label: h, where: '', fw: 400, op: 0, done: '', pick: null }); last = h; } out.push({ head: false, row: true, label: v[0], where: v[1] + ' ' + v[2], fw: k === s.src ? 600 : 400, op: k === s.src ? 1 : 0, done: (s.sst[k] || 0) >= 4 ? '완료' : '', pick: () => self.setState({ src: k, dd: false }) }); }); return out; })(), srcPrev: () => self.setState({ src: (self.state.src + SRC.length - 1) % SRC.length }), srcNext: () => self.setState({ src: (self.state.src + 1) % SRC.length }),
pct: Math.round(100 * Math.min(idx, N) / N) + '%', progress: Math.min(idx, N) + ' / ' + N,
done: g.steps.slice(0, idx).map((x, i) => ({ t: (i + 1) + ' · ' + x[0], bt: i === 0 ? 'none' : '0.5px solid var(--sep)', go: () => setIdx(i) })), hasDone: idx > 0,
now: now, hasNow: idx < N, allDone: idx >= N, doneMsg: g.msg, restart: () => setIdx(0),
left: g.steps.slice(idx + 1).map((x, i) => ({ t: (idx + i + 2) + ' · ' + x[0], bt: i === 0 ? 'none' : '0.5px solid var(--sep)' })), hasLeft: idx + 1 < N,
doneNow: () => setIdx(idx + 1),
help: () => self.setState({ help: true, closing: false }), helpOpen: !!s.help, helpClose: () => shut({ help: false }),
tips: [{ t: '1) 해당 채널 MUTE가 꺼져 있는지(OFF) 확인하세요.' }, { t: '2) 케이블이 배선 탭의 단자에 맞게 꽂혀 있는지 확인하세요.' }, { t: '3) 믹서와 앰프 전원 램프가 켜져 있는지 확인하세요.' }, { t: '4) GAIN과 페이더가 맨 아래가 아닌지 확인하세요. 점검 탭에 알림이 있으면 먼저 보세요.' }],
sheetAnim: s.closing ? 'sheetDown .22s ease-in forwards' : 'sheetUp .28s cubic-bezier(.2,.8,.2,1)', dimAnim: s.closing ? 'dimOut .22s ease-in forwards' : 'dimIn .2s ease-out'
};
}
}

export function create() { return new Component({}); }
