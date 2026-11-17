const fs=require('fs');const {geo}=require('./common.js');const PR=process.argv[2];
const g=geo(PR,{live:false,labels:true});
const title=`<text x="40" y="48" font-size="24" font-weight="700" fill="#1d1d1f">중명교회 음향 장비 전체 배선도</text><text x="40" y="74" font-size="12" fill="#555">실제 믹서 그림 위에 케이블이 꽂히는 단자를 그대로 연결했어요. 선이 겹치지 않게 배치했어요.</text>`;
const legend=`<g font-size="11" fill="#333"><rect x="40" y="1890" width="720" height="150" rx="10" fill="#fff" stroke="#d1d1d6"/><text x="56" y="1914" font-weight="700" font-size="13">범례·메모</text><path d="M56 1932 H96" stroke="#444" stroke-width="3.5"/><text x="104" y="1936">XLR</text><path d="M160 1932 H200" stroke="#6B7280" stroke-width="3.5"/><text x="208" y="1936">TS/RCA</text><path d="M290 1932 H330" stroke="#B45309" stroke-width="3.5" stroke-dasharray="8 6"/><text x="338" y="1936">AG06 → DFX 9/10</text><path d="M470 1932 H510" stroke="#0F766E" stroke-width="3.5"/><text x="518" y="1936">드럼 TS→RCA</text><text x="56" y="1964">· 키보드는 TRS로 나와서 TS 2줄로 AG06 3/4에 꽂아요.</text><text x="56" y="1984">· 드럼은 TS 모노 2줄을 RCA로 바꿔 AG06 5/6에 꽂아요.</text><text x="56" y="2004">· 베이스·기타는 각각 DI BOX를 거쳐 AG06 CH1·CH2에 연결돼요.</text><text x="56" y="2024">· 주황 ! / 빨강 × 배지는 점검이 필요한 지점이에요.</text></g>`;
const W=800,H=2170;
const html=`<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>전체 배선도</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap">
<style>body{margin:0}</style>
</helmet>
<div style="position:relative;width:${W}px;height:${H}px;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'SF Pro',system-ui,'Noto Sans KR',sans-serif;overflow:hidden">
<div id="zoomroot" onPointerDown="{{down}}" onPointerMove="{{move}}" onPointerUp="{{up}}" onPointerCancel="{{up}}" onWheel="{{wheel}}" style="position:absolute;inset:0;overflow:hidden;touch-action:none;cursor:grab;user-select:none">
<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="group" aria-label="전체 배선도. 두 손가락으로 벌리거나 모아서 확대·축소" font-family="Noto Sans KR, sans-serif">
<g transform="{{tf}}">
${title}<g transform="translate(40,100) scale(2)">${g.cab}${g.pics}${g.boxes}${g.labs}${g.badges}${g.names}</g><g transform="translate(0,110)">${legend}</g>
</g>
</svg>
</div>
<div style="position:absolute;right:16px;top:16px;display:flex;gap:8px;align-items:center;z-index:2">
<span style="padding:6px 12px;border-radius:16px;background:rgba(255,255,255,0.92);font-size:13px;color:#1d1d1f;box-shadow:0 1px 4px rgba(0,0,0,0.2)">두 손가락으로 확대·축소 · 끌어서 이동</span>
<button onClick="{{zout}}" aria-label="축소" style="width:44px;height:44px;border:0;border-radius:22px;background:#fff;font-size:24px;box-shadow:0 1px 4px rgba(0,0,0,0.25)">−</button>
<button onClick="{{zin}}" aria-label="확대" style="width:44px;height:44px;border:0;border-radius:22px;background:#fff;font-size:24px;box-shadow:0 1px 4px rgba(0,0,0,0.25)">+</button>
<button onClick="{{zreset}}" aria-label="처음 크기" style="min-height:44px;padding:0 14px;border:0;border-radius:22px;background:#0066cc;color:#fff;font-size:15px;font-weight:600;box-shadow:0 1px 4px rgba(0,0,0,0.25)">전체</button>
</div>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":${W},"height":${H}}}'>
class Component extends DCLogic {
constructor(props) {
super(props);
this.state = { k: 1, x: 0, y: 0 };
this.ptrs = {};
this.base = null;
}
box() {
const el = document.getElementById('zoomroot');
const r = el ? el.getBoundingClientRect() : { left: 0, top: 0, width: ${W}, height: ${H} };
return { l: r.left, t: r.top, f: ${W} / (r.width || ${W}) };
}
zoomAt(nk, cx, cy) {
const s = this.state;
nk = Math.max(0.4, Math.min(8, nk));
const px = (cx - s.x) / s.k, py = (cy - s.y) / s.k;
this.setState({ k: nk, x: cx - nk * px, y: cy - nk * py });
}
// SYNC-BEGIN
componentDidMount() {
const self = this; this.__d = {};
const patch = (b) => {
const p = self.__d[b]; if (!p || !p.vals) return;
const root = document.querySelector('svg[data-b="' + b + '"]'); if (!root) return;
root.querySelectorAll('[data-cid]').forEach((g) => {
const v = p.vals[g.getAttribute('data-cid')]; if (v === undefined || v === null) return;
const kl = g.querySelector('[data-r="kl"]');
if (kl) kl.setAttribute('transform', 'translate(' + kl.getAttribute('data-x') + ',' + kl.getAttribute('data-y') + ') rotate(' + (-135 + 270 * v) + ')');
const fc = g.querySelector('[data-r="fc"]');
if (fc) fc.setAttribute('y', String(Number(fc.getAttribute('data-ya')) + Number(fc.getAttribute('data-yb')) * v));
const bf = g.querySelector('[data-r="bf"]');
if (bf) {
const on = v === 1; const col = g.getAttribute('data-col');
bf.setAttribute('fill', on ? col : '#5E6166'); bf.setAttribute('stroke', on ? '#1B1F23' : '#3A3C40');
const q = (r) => g.querySelector('[data-r="' + r + '"]');
q('bg').setAttribute('opacity', on ? '1' : '0'); q('bon').setAttribute('opacity', on ? '1' : '0'); q('boff').setAttribute('opacity', on ? '0' : '1');
}
});
const p1 = root.querySelector('[data-r="ph1"]'); const p2 = root.querySelector('[data-r="ph2"]');
if (p1 && p.phantom !== undefined) { p1.setAttribute('fill', p.phantom ? '#E0332B' : '#5A2A2A'); p2.setAttribute('x', p.phantom ? '389' : '374'); }
};
const take = (b, p) => { if (!p || !p.vals) return; const o = self.__d[b]; if (o && o.t >= p.t) return; self.__d[b] = p; patch(b); };
const rd = () => ['ag', 'dfx', 'l4'].forEach((b) => { try { take(b, JSON.parse(window.localStorage.getItem('mixsync:' + b))); } catch (e) {} });
rd(); window.addEventListener('storage', rd);
this.__iv = setInterval(() => { rd(); ['ag', 'dfx', 'l4'].forEach(patch); }, 1500);
try { if (window.claude && window.claude.use) window.claude.use('db').then((db) => { if (db) ['ag', 'dfx', 'l4'].forEach((b) => db.doc('mixer/' + b).onSnapshot((s) => { if (s.exists) take(b, s.data()); }, () => {})); }).catch(() => {}); } catch (e) {}
}
componentWillUnmount() { clearInterval(this.__iv); }
// SYNC-END
renderVals() {
const s = this.state;
const self = this;
const pts = () => Object.keys(self.ptrs).map((k) => self.ptrs[k]);
const loc = (e) => { const b = self.box(); return { x: (e.clientX - b.l) * b.f, y: (e.clientY - b.t) * b.f }; };
const start = () => {
const p = pts();
if (p.length === 2) {
const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) || 1;
self.base = { d: d, k: self.state.k, mx: (p[0].x + p[1].x) / 2, my: (p[0].y + p[1].y) / 2, x: self.state.x, y: self.state.y };
} else if (p.length === 1) {
self.base = { px: p[0].x, py: p[0].y, x: self.state.x, y: self.state.y };
} else self.base = null;
};
return {
tf: 'translate(' + s.x.toFixed(2) + ',' + s.y.toFixed(2) + ') scale(' + s.k.toFixed(4) + ')',
down: (e) => { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (x) {} self.ptrs[e.pointerId] = loc(e); start(); },
move: (e) => {
if (!self.ptrs[e.pointerId]) return;
self.ptrs[e.pointerId] = loc(e);
const p = pts(), b = self.base;
if (!b) return;
if (p.length >= 2 && b.d) {
const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) || 1;
const nk = Math.max(0.4, Math.min(8, b.k * d / b.d));
const mx = (p[0].x + p[1].x) / 2, my = (p[0].y + p[1].y) / 2;
const qx = (b.mx - b.x) / b.k, qy = (b.my - b.y) / b.k;
self.setState({ k: nk, x: mx - nk * qx, y: my - nk * qy });
} else if (p.length === 1 && b.px != null) {
self.setState({ x: b.x + (p[0].x - b.px), y: b.y + (p[0].y - b.py) });
}
},
up: (e) => { delete self.ptrs[e.pointerId]; start(); },
wheel: (e) => { if (e.preventDefault) e.preventDefault(); const l = loc(e); self.zoomAt(self.state.k * Math.exp(-e.deltaY * 0.0025), l.x, l.y); },
zin: () => self.zoomAt(self.state.k * 1.4, ${W} / 2, ${H} / 2),
zout: () => self.zoomAt(self.state.k / 1.4, ${W} / 2, ${H} / 2),
zreset: () => self.setState({ k: 1, x: 0, y: 0 })
};
}
}
</script>
</body>
</html>
`;
fs.writeFileSync(PR+'/System.dc.html',html);console.log(html.length);
