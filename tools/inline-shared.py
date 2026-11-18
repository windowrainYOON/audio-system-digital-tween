#!/usr/bin/env python3
"""tools/ovlayout.js·tools/pinch.js를 시안 파일에 붙여 넣는다 (표식 사이를 통째로 바꾼다).
- MobOverview: 클래스 메서드 ovLayout(cur, base) (OVLAYOUT-BEGIN/END)
- 홈·패널(MobOverview, MobAg06, MobDfx, MobL4): constructor 끝의 PINCH-BEGIN/END
"""
import re, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
D = R / 'design'
ov = (R / 'tools/ovlayout.js').read_text()
body = ov[ov.index('function ovLayout('):]
meth = '// OVLAYOUT-BEGIN (tools/ovlayout.js에서 붙여 넣음, 직접 고치지 말 것)\n' + body.replace('function ovLayout(', 'ovLayout(', 1).rstrip() + '\n// OVLAYOUT-END\n'
pin = (R / 'tools/pinch.js').read_text().rstrip() + '\n'
ZMIN = {'MobOverview': '1', 'MobAg06': '0.5', 'MobDfx': '0.5', 'MobL4': '0.5'}

def put(s, a, b, text, anchor):
    if a in s:
        return re.sub(re.escape(a) + r'.*?' + re.escape(b) + r'\n', lambda m: text, s, flags=re.S)
    i = s.index(anchor)
    return s[:i] + text + s[i:]

for name, zmin in ZMIN.items():
    p = D / (name + '.dc.html'); s = p.read_text()
    blk = pin.replace('PINCH_MIN', zmin)
    if '// PINCH-BEGIN' in s:
        s = re.sub(r'// PINCH-BEGIN.*?// PINCH-END\n', lambda m: blk, s, flags=re.S)
    else:
        # constructor의 this.state = ... 줄 다음
        m = re.search(r'\nconstructor\(props\) \{.*?\n(this\.state = [^\n]*\n)', s, flags=re.S)
        i = m.end()
        s = s[:i] + blk + s[i:]
    if name == 'MobOverview':
        if '// OVLAYOUT-BEGIN' in s:
            s = re.sub(r'// OVLAYOUT-BEGIN.*?// OVLAYOUT-END\n', lambda m: meth, s, flags=re.S)
        else:
            i = s.index('\nrenderVals() {') + 1
            s = s[:i] + meth + s[i:]
    p.write_text(s)
    print('ok', name)
