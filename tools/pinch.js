// PINCH-BEGIN 2026-11-18 사용자 결정: 홈·패널 탭은 두 손가락(트랙패드는 ctrl+휠)으로 확대·축소. +/− 버튼은 없앴다.
// 확대 배율은 state.z, 대상은 id="pan" 스크롤 상자. 손가락 가운데가 제자리에 머물게 스크롤을 맞춘다.
if (typeof document !== 'undefined' && document.addEventListener && !this.__pinch) {
const self = this; this.__pinch = 1; let d0 = 0, z0 = 1;
const ZMIN = PINCH_MIN, ZMAX = 3;
const box = () => document.getElementById('pan');
const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
const zoomTo = (z, cx, cy) => { const el = box(); const zp = self.state.z || 1; z = Math.max(ZMIN, Math.min(ZMAX, z)); if (!el || Math.abs(z - zp) < 0.001) return; const r = el.getBoundingClientRect(); const px = cx - r.left, py = cy - r.top; const sx = (el.scrollLeft + px) * z / zp - px, sy = (el.scrollTop + py) * z / zp - py; self.setState({ z: z }); requestAnimationFrame(() => { el.scrollLeft = sx; el.scrollTop = sy; }); };
document.addEventListener('touchstart', (e) => { const el = box(); if (e.touches.length === 2 && el && el.contains(e.target)) { d0 = dist(e.touches); z0 = self.state.z || 1; } }, { passive: true });
document.addEventListener('touchmove', (e) => { if (!d0 || e.touches.length !== 2) return; e.preventDefault(); const t = e.touches; zoomTo(z0 * dist(t) / d0, (t[0].clientX + t[1].clientX) / 2, (t[0].clientY + t[1].clientY) / 2); }, { passive: false });
document.addEventListener('touchend', (e) => { if (e.touches.length < 2) d0 = 0; }, { passive: true });
document.addEventListener('wheel', (e) => { const el = box(); if (!e.ctrlKey || !el || !el.contains(e.target)) return; e.preventDefault(); zoomTo((self.state.z || 1) * Math.exp(-e.deltaY / 150), e.clientX, e.clientY); }, { passive: false });
}
// PINCH-END
