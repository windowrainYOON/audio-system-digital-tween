# 시안의 하단 탭바(홈·배선·패널·점검·운영) 버튼에 아이콘을 넣는다. 아이콘 원본: design/icons/tab-*.svg
import re, os, sys
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'design')
TABS = {
 '홈': ('home', '<path d="M4 11 L12 4 L20 11"/><path d="M6 9.5 V20 H18 V9.5"/><path d="M10 20 v-5 h4 v5"/>'),
 '배선': ('wiring', '<rect x="2.5" y="4" width="5" height="6" rx="1.2"/><path d="M5 10 v3 q0 6 7 6 q7 0 7 -6 v-3"/><rect x="16.5" y="4" width="5" height="6" rx="1.2"/><path d="M4 4 V2 M6 4 V2 M18 4 V2 M20 4 V2"/>'),
 '패널': ('panel', '<path d="M6 3 V21 M12 3 V21 M18 3 V21"/><rect x="3.5" y="13" width="5" height="3.5" rx="1"/><rect x="9.5" y="6" width="5" height="3.5" rx="1"/><rect x="15.5" y="10" width="5" height="3.5" rx="1"/>'),
 '점검': ('checks', '<circle cx="11" cy="11" r="7"/><path d="M16 16 L21 21"/><path d="M8 11 l2 2 l4 -4"/>'),
 '운영': ('operate', '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4 V2.8 h6 V4"/><path d="M8.5 10 l1.5 1.5 l3 -3"/><path d="M8.5 16 h7"/>'),
}
os.makedirs(os.path.join(D, 'icons'), exist_ok=True)
for lbl, (slug, p) in TABS.items():
    open(os.path.join(D, 'icons', 'tab-%s.svg' % slug), 'w').write(
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">%s</svg>\n' % p)
BTN = re.compile(r'<button style="(min-height:48px;[^"]*)">(홈|배선|패널|점검|운영)</button>')
def fix(m):
    st, lbl = m.group(1), m.group(2)
    if 'flex-direction:column' not in st:
        st += ';display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:0'
    svg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg>' % TABS[lbl][1]
    return '<button style="%s">%s%s</button>' % (st, svg, lbl)
for f in sorted(os.listdir(D)):
    if not (f.startswith('Mob') and f.endswith('.dc.html')): continue
    s = open(os.path.join(D, f), encoding='utf-8').read()
    nav = re.search(r'<nav aria-label="하단 메뉴".*?</nav>', s, re.S)
    if not nav: continue
    new = BTN.sub(fix, nav.group(0))
    if new != nav.group(0):
        open(os.path.join(D, f), 'w', encoding='utf-8').write(s.replace(nav.group(0), new)); print('updated', f)
