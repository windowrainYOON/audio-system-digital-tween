# 모바일 시안 → 태블릿 시안(design/Tab*{P,L}.dc.html). 규칙: docs/UI_GUIDE.md 4.T
# 화면 구조·로직은 모바일과 같고, 크기·여백·팝업 폭·확대 배율을 바꾼다. 패널 인스펙터만 오른쪽 고정 카드(2026-11-17 사용자 결정).
# 사용: python3 tools/make-tablet-drafts.py [원본폴더] [출력폴더]  (기본값 모두 design/)
import re, sys, os
HERE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'design')
SRC = sys.argv[1] if len(sys.argv) > 1 else HERE
OUT = sys.argv[2] if len(sys.argv) > 2 else HERE
NAMES = {'MobOverview': 'TabOverview', 'MobWiring': 'TabWiring', 'MobL4': 'TabL4', 'MobDfx': 'TabDfx', 'MobAg06': 'TabAg06', 'MobChecks': 'TabChecks', 'Mobile': 'TabOperator'}
PANEL_W = {'MobL4': 528, 'MobDfx': 835, 'MobAg06': 560}
def rep(s, a, b, n=None):
    c = s.count(a)
    assert c >= 1 and (n is None or c == n), (a[:80], c)
    return s.replace(a, b)
def make(mob, land):
    W, H = (1194, 834) if land else (834, 1194)
    o = 'L' if land else 'P'
    s = open(os.path.join(SRC, mob + '.dc.html'), encoding='utf-8').read()
    s = rep(s, 'position:relative;width:390px;height:844px;', 'position:relative;width:%dpx;height:%dpx;' % (W, H), 1)
    s = rep(s, '"$preview":{"width":390,"height":844}', '"$preview":{"width":%d,"height":%d}' % (W, H), 1)
    s = re.sub(r'<title>([^<]*)</title>', lambda m: '<title>%s · 태블릿 %s</title>' % (m.group(1), '가로' if land else '세로'), s, count=1)
    for a, b in NAMES.items():
        s = s.replace('href="%s.dc.html"' % a, 'href="%s%s.dc.html"' % (b, o))
    # header / page gutters
    s = s.replace('<header style="flex:none;padding:12px 16px ', '<header style="flex:none;padding:16px 24px ')
    # tab bar: centered pill
    s = rep(s, '<nav aria-label="하단 메뉴" style="position:absolute;left:12px;right:12px;bottom:12px;', '<nav aria-label="하단 메뉴" style="position:absolute;left:50%;width:480px;margin-left:-240px;bottom:16px;', 1)
    # dropdown menus: under their button, header gutter 24, +4 for taller header padding
    for t in (112, 164, 172):
        s = s.replace('style="position:absolute;left:16px;right:16px;top:%dpx;' % t, 'style="position:absolute;left:24px;width:440px;top:%dpx;' % (t + 4))
    # panel pages: inspector is a fixed card on the right (always visible, no slide/outside-tap close)
    if mob in PANEL_W:
        top = 180
        s = rep(s, 'animation:{{sheetAnim}};position:absolute;left:12px;right:12px;bottom:80px;max-height:470px;border-radius:28px;', 'position:absolute;right:16px;width:380px;top:%dpx;bottom:88px;overflow-y:auto;border-radius:22px;' % top, 1)
        s = re.sub(r'<button onClick="\{\{hideInsp\}\}".*?</button>', '', s, count=1, flags=re.S)
        s = rep(s, 'inspOpen: !!this.state.open,', 'inspOpen: true,', 1)
        s = s.replace('bgTap: (e) => {', 'bgTap: (e) => { return; ', 1)
    # bottom sheets: same pattern, centered with a fixed width
    s = s.replace('position:absolute;left:12px;right:12px;bottom:80px;', 'position:absolute;left:50%;width:560px;margin-left:-280px;bottom:88px;')
    top = 80 if land else 160
    s = s.replace('position:absolute;left:0;right:0;bottom:0;top:56px;', 'position:absolute;left:50%;width:620px;margin-left:-310px;bottom:0;top:' + str(top) + 'px;')
    s = s.replace('position:absolute;left:40px;right:40px;top:300px;', 'position:absolute;left:50%;width:320px;margin-left:-160px;top:38%;')
    s = s.replace('position:absolute;left:16px;right:16px;bottom:84px;', 'position:absolute;left:50%;width:480px;margin-left:-240px;bottom:88px;')
    # list pages: centered reading column
    for a in ['<main style="flex:1;min-height:0;overflow-y:auto;padding:8px 16px 100px">', '<main style="flex:1;overflow-y:auto;padding:16px 16px 100px">', '<main style="flex:1;min-height:0;overflow-y:auto;padding:12px 16px 100px;']:
        s = s.replace(a, a.replace('16px', 'max(24px, calc(50% - 380px))'))
    # drawings: bigger default zoom
    if mob == 'MobOverview':
        s = rep(s, "f: 'all', z: 1 };", "f: 'all', z: %s };" % ('1.5' if land else '1.2'), 1)
        s = s.replace('zOut: () => self.setState({ z: Math.max(1,', 'zOut: () => self.setState({ z: Math.max(0.75,')
    if mob in PANEL_W:
        k = round((W - 24 - 404) / PANEL_W[mob], 2)
        k = max(min(k, 1.6), 0.7)
        s = rep(s, 'this.state = { more: false,', 'this.state = { z: %s, more: false,' % k, 1)
        s = s.replace('<main id="pan" onClick="{{bgTap}}" style="flex:1;', '<main id="pan" onClick="{{bgTap}}" style="margin:0 412px 88px 12px;border-radius:18px;flex:1;')
    return s
for mob in NAMES:
    for land in (False, True):
        out = NAMES[mob] + ('L' if land else 'P') + '.dc.html'
        open(os.path.join(OUT, out), 'w', encoding='utf-8').write(make(mob, land))
print('ok')
