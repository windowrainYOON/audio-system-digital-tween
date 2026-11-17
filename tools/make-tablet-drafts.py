# 모바일 시안(design/Mob*.dc.html, Mobile.dc.html) → 태블릿 시안(design/Tab*{P,L}.dc.html).
# 믹서 그림·케이블·로직은 그대로 두고 배치(크기, 헤더, 인스펙터 위치)만 바꾼다. 규칙: docs/UI_GUIDE.md 4.T
# 사용: python3 tools/make-tablet-drafts.py [원본폴더] [출력폴더]  (기본값 모두 design/)
import re, sys, os
HERE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'design')
SRC = sys.argv[1] if len(sys.argv) > 1 else HERE
OUT = sys.argv[2] if len(sys.argv) > 2 else HERE
os.makedirs(OUT, exist_ok=True)
def rd(f): return open(os.path.join(SRC, f), encoding='utf-8').read()
def wr(f, s): open(os.path.join(OUT, f), 'w', encoding='utf-8').write(s)
def rep(s, a, b, n=1):
    c = s.count(a)
    assert c == n, (a[:80], c)
    return s.replace(a, b)
ROOT_M = 'position:relative;width:390px;height:844px;'
PREV_M = '"$preview":{"width":390,"height":844}'
def size(s, w, h, title):
    s = rep(s, ROOT_M, 'position:relative;width:%dpx;height:%dpx;' % (w, h))
    s = rep(s, PREV_M, '"$preview":{"width":%d,"height":%d}' % (w, h))
    s = re.sub(r'<title>[^<]*</title>', '<title>%s</title>' % title, s, count=1)
    return s

# ---------- Overview ----------
def overview(land):
    s = rd('MobOverview.dc.html')
    W, H = (1194, 834) if land else (834, 1194)
    k = 1.5 if land else 1.2
    s = size(s, W, H, '간략 보기 · 태블릿 ' + ('가로' if land else '세로'))
    # header: one row, segment fixed width, chips beside
    s = rep(s, '<header style="flex:none;padding:8px 16px 0;display:flex;flex-direction:column;gap:8px">',
               '<header style="flex:none;padding:12px 20px 8px;display:flex;align-items:center;gap:16px">')
    s = rep(s, '<div style="display:flex;background:var(--fill3);border-radius:22px;padding:2px">',
               '<div style="flex:none;width:320px;display:flex;background:var(--fill3);border-radius:22px;padding:2px">')
    s = rep(s, '<div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:8px">',
               '<div style="flex:1;min-width:0;display:flex;gap:8px;overflow-x:auto">')
    # body row: drawing (scroll) + side info column
    s = rep(s, '<main style="flex:1;min-height:0;overflow-y:auto;padding:8px 16px 300px">',
               '<div style="flex:1;min-height:0;display:flex;gap:20px;padding:0 20px 20px">\n  <main style="flex:none;min-height:0;overflow-y:auto;padding:12px 16px;background:#fff;border-radius:18px;box-shadow:0 0 0 0.5px var(--sep)">')
    s = rep(s, '<svg viewBox="0 0 358 940" width="358" height="940"',
               '<svg viewBox="0 0 358 940" width="%g" height="%g"' % (358*k, 940*k))
    s = rep(s, '<section aria-label="선택한 장비" style="position:absolute;left:12px;right:12px;bottom:12px;border-radius:28px;background:rgba(255,255,255,0.94);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:0 8px 30px rgba(0,0,0,0.18),0 0 0 0.5px var(--sep);padding:16px;display:flex;flex-direction:column;gap:8px">',
               '<section aria-label="선택한 장비" style="flex:1;min-width:0;align-self:flex-start;border-radius:28px;background:#fff;box-shadow:0 0 0 0.5px var(--sep);padding:20px;display:flex;flex-direction:column;gap:10px">')
    s = rep(s, '<div style="flex:1;font-size:17px;line-height:22px;font-weight:600">{{info.title}}</div>',
               '<div style="flex:1;font-size:20px;line-height:25px;font-weight:600">{{info.title}}</div>')
    s = rep(s, '<button style="min-height:44px;border:0;border-radius:22px;background:var(--accent);color:#fff;font-size:17px;font-weight:600">{{info.go}}</button>\n  </section>',
               '<button style="min-height:50px;margin-top:6px;border:0;border-radius:25px;background:var(--accent);color:#fff;font-size:17px;font-weight:600">{{info.go}}</button>\n  </section>\n  </div>')
    return s

# ---------- Detail ----------
DET = {'L4': ('MobL4.dc.html', 660, 100.0, 150.0, 700),
       'DFX': ('MobDfx.dc.html', 928, 0.0, -150.0, 1000),
       'AG06': ('MobAg06.dc.html', 622, -10.0, -130.0, 910)}
def detail(dev, land):
    f, vbw, x0, y0, vbh = DET[dev]
    s = rd(f)
    W, H = (1194, 834) if land else (834, 1194)
    name = {'L4': 'L4', 'DFX': 'DFX-12', 'AG06': 'AG06'}[dev]
    s = size(s, W, H, '상세 · %s · 태블릿 %s' % (name, '가로' if land else '세로'))
    avail = (1194 - 400 - 20) if land else (834 - 24)
    k = min(avail / vbw, 1.25)
    m = re.search(r'<svg id="pansvg" viewBox="[^"]*" width="(\d+)" height="(\d+)"', s)
    oldk = int(m.group(1)) / vbw
    s = s.replace(m.group(0), m.group(0).replace('width="%s" height="%s"' % (m.group(1), m.group(2)),
                  'width="%d" height="%d"' % (round(vbw * k), round(vbh * k))))
    # fix scroll factor in section chips
    s, n = re.subn(r'\(x - (-?[\d.]+)\) \* [\d.]+ - 12\), top: Math.max\(0, \(y - (-?[\d.]+)\) \* [\d.]+ - 12\)',
                   lambda mm: '(x - %s) * %.4f - 12), top: Math.max(0, (y - %s) * %.4f - 12)' % (mm.group(1), k, mm.group(2), k), s)
    assert n == 1, n
    s = rep(s, '<div style="height:520px" aria-hidden="true"></div>', '')
    hs = s.index('<header'); he = s.index('</header>')
    hd = s[hs:he]
    if land:
        hd = rep(hd, 'flex:none;padding:8px 16px 0;display:flex;flex-direction:column;gap:8px;', 'flex:none;padding:12px 20px;display:flex;align-items:center;gap:16px;')
        hd = rep(hd, '<div style="display:flex;gap:8px;align-items:center">', '<div style="flex:none;display:flex;gap:8px;align-items:center">')
        hd = rep(hd, '<div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:8px">', '<div style="flex:1;min-width:0;display:flex;gap:8px;overflow-x:auto">')
    else:
        hd = rep(hd, 'flex:none;padding:8px 16px 0;', 'flex:none;padding:12px 20px 0;')
    hd = hd.replace('style="flex:1;min-height:44px;border:0;border-radius:22px;', 'style="flex:none;width:104px;min-height:44px;border:0;border-radius:22px;')
    s = s[:hs] + hd + s[he:]
    SEC = '<section aria-label="선택한 컨트롤" style="position:absolute;left:12px;right:12px;bottom:12px;max-height:540px;border-radius:28px;background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:0 8px 30px rgba(0,0,0,0.18),0 0 0 0.5px var(--sep);padding:16px 16px 14px;display:flex;flex-direction:column;gap:8px;z-index:3">'
    INNER = '<div style="flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:8px">'
    mainstyle = 'style="flex:1;min-height:0;overflow:auto;background:#e5e5ea;-webkit-overflow-scrolling:touch">'
    if land:
        s = rep(s, '<main id="pan"', '<div style="flex:1;min-height:0;display:flex;gap:16px;padding:0 16px 16px">\n  <main id="pan"')
        s = rep(s, mainstyle, 'style="flex:1;min-width:0;min-height:0;overflow:auto;background:#e5e5ea;border-radius:18px;-webkit-overflow-scrolling:touch">')
        s = rep(s, SEC, '<section aria-label="선택한 컨트롤" style="flex:none;width:380px;box-sizing:border-box;border-radius:28px;background:#fff;box-shadow:0 0 0 0.5px var(--sep);padding:20px 20px 16px;display:flex;flex-direction:column;gap:10px">')
        s = s.replace('<svg width="132" height="132" viewBox="0 0 132 132"', '<svg width="172" height="172" viewBox="0 0 132 132"')
        s = s.replace('<svg width="64" height="156" viewBox="0 0 64 156"', '<svg width="80" height="195" viewBox="0 0 64 156"')
        s = rep(s, '실물에 맞췄어요</button>\n  </section>', '실물에 맞췄어요</button>\n  </section>\n  </div>')
    else:
        s = rep(s, mainstyle, 'style="flex:1;min-height:0;overflow:auto;background:#e5e5ea;margin:0 12px;border-radius:18px;-webkit-overflow-scrolling:touch">')
        s = rep(s, SEC, '<section aria-label="선택한 컨트롤" style="flex:none;height:380px;box-sizing:border-box;margin:12px;border-radius:28px;background:#fff;box-shadow:0 0 0 0.5px var(--sep);padding:20px 20px 16px;display:flex;flex-direction:column;gap:10px">')
        s = rep(s, INNER, '<div style="flex:1;min-height:0;overflow-y:auto;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px 20px;align-content:start">')
        # left column: control (knob/fader/toggle); right column: values + explanation
        s = rep(s, '<div style="flex:none;display:flex;align-items:center;justify-content:center;gap:12px">',
                   '<div style="grid-column:1;grid-row:1 / span 3;align-self:center;display:flex;align-items:center;justify-content:center;gap:12px">')
        s = rep(s, '<div style="flex:none;display:flex;align-items:center;justify-content:center;gap:16px">',
                   '<div style="grid-column:1;grid-row:1 / span 3;align-self:center;display:flex;align-items:center;justify-content:center;gap:16px">')
        s = s.replace('<button onClick="{{onToggle}}" style="width:100%;', '<button onClick="{{onToggle}}" style="grid-column:1;grid-row:1 / span 3;align-self:center;width:100%;')
        s = rep(s, '<div style="background:var(--fill3);border-radius:14px;padding:8px 12px;display:flex;flex-direction:column;gap:2px">',
                   '<div style="grid-column:2;background:var(--fill3);border-radius:14px;padding:8px 12px;display:flex;flex-direction:column;gap:2px">')
        s = rep(s, '<button onClick="{{toggleMore}}" aria-expanded="{{more}}" style="flex:none;', '<button onClick="{{toggleMore}}" aria-expanded="{{more}}" style="grid-column:2;')
        s = rep(s, '<div style="background:var(--fill3);border-radius:14px;padding:10px 12px;display:flex;flex-direction:column;gap:8px">',
                   '<div style="grid-column:2;background:var(--fill3);border-radius:14px;padding:10px 12px;display:flex;flex-direction:column;gap:8px">')
        s = s.replace('<svg width="132" height="132" viewBox="0 0 132 132"', '<svg width="160" height="160" viewBox="0 0 132 132"')
        s = s.replace('<svg width="64" height="156" viewBox="0 0 64 156"', '<svg width="72" height="176" viewBox="0 0 64 156"')
    return s

# ---------- Wiring (iPad form sheet) ----------
def wiring(land):
    s = rd('MobWiring.dc.html')
    W, H = (1194, 834) if land else (834, 1194)
    s = size(s, W, H, '배선 · 태블릿 ' + ('가로' if land else '세로'))
    s = rep(s, '<header style="padding:12px 16px 0;', '<header style="padding:16px 24px 0;')
    s = rep(s, '<div style="padding:4px 16px 0;display:flex;align-items:center;gap:8px;font-size:13px', '<div style="padding:4px 24px 0;display:flex;align-items:center;gap:8px;font-size:13px')
    s = rep(s, '<div style="margin:8px 16px 0;padding:2px;border-radius:9px;background:var(--fill3);display:grid;grid-template-columns:1fr 1fr">',
               '<div style="margin:8px 24px 0;width:360px;padding:2px;border-radius:9px;background:var(--fill3);display:grid;grid-template-columns:1fr 1fr">')
    s = rep(s, '<div style="margin:8px 16px 0;padding:12px 16px;border-radius:18px;background:#ff8d2829', '<div style="margin:8px 24px 0;padding:12px 16px;border-radius:18px;background:#ff8d2829')
    cols = 2 if land else 1
    s = rep(s, '<main style="flex:1;overflow-y:auto;padding:16px 16px 100px">',
               '<main style="flex:1;overflow-y:auto;padding:16px 24px 100px">')
    if land:
        # groups flow into two columns
        s = rep(s, '<sc-for list="{{groups}}" as="g" hint-placeholder-count="4">', '<div style="columns:2;column-gap:24px"><sc-for list="{{groups}}" as="g" hint-placeholder-count="4">')
        s = rep(s, '<sc-for list="{{jgroups}}" as="jg" hint-placeholder-count="3">', '<div style="columns:2;column-gap:24px"><sc-for list="{{jgroups}}" as="jg" hint-placeholder-count="3">')
        s = s.replace('</sc-for>\n    </sc-if>\n    <sc-if value="{{tabCable}}"', '</sc-for></div>\n    </sc-if>\n    <sc-if value="{{tabCable}}"', 1)
        s = rep(s, '    </sc-for>\n    </sc-if>\n  </main>', '    </sc-for></div>\n    </sc-if>\n  </main>')
        s = s.replace('<div style="margin-bottom:24px">', '<div style="margin-bottom:24px;break-inside:avoid">')
    s = rep(s, '<nav aria-label="하단 메뉴" style="position:absolute;left:12px;right:12px;bottom:12px;',
               '<nav aria-label="하단 메뉴" style="position:absolute;left:50%;width:480px;margin-left:-240px;bottom:16px;')
    SH = 'style="position:absolute;left:0;right:0;bottom:0;top:56px;background:var(--bg);border-radius:18px 18px 0 0;display:flex;flex-direction:column;overflow:hidden">'
    if land:
        new = 'style="position:absolute;left:50%;width:600px;margin-left:-300px;top:40px;bottom:40px;background:var(--bg);border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,0.3);display:flex;flex-direction:column;overflow:hidden">'
    else:
        new = 'style="position:absolute;left:50%;width:620px;margin-left:-310px;top:120px;bottom:120px;background:var(--bg);border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,0.3);display:flex;flex-direction:column;overflow:hidden">'
    s = rep(s, SH, new, 2)
    s = s.replace('<div style="width:36px;height:5px;border-radius:3px;background:var(--fill)"></div>\n', '')
    return s

# ---------- Operator ----------
def operator(land):
    s = rd('Mobile.dc.html')
    W, H = (1194, 834) if land else (834, 1194)
    s = size(s, W, H, '운영자 세팅 안내 · 태블릿 ' + ('가로' if land else '세로'))
    s = rep(s, '<header style="padding:12px 16px 0;', '<header style="padding:20px 32px 0;')
    s = rep(s, '<div style="padding:8px 16px 0"><div style="height:4px', '<div style="padding:12px 32px 0"><div style="height:4px')
    s = rep(s, '<span style="font-size:15px;line-height:20px;color:var(--label2)">2 / 5</span>', '<span style="font-size:17px;line-height:22px;color:var(--label2)">2 / 5</span>')
    # bigger knob pictures on tablet
    s = s.replace('<svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">', '<svg width="112" height="112" viewBox="0 0 64 64" aria-hidden="true">')
    s = s.replace('<div style="font-weight:600">GAIN</div><div style="font-size:15px;line-height:20px;color:var(--label2)">11시</div>',
                  '<div style="font-size:20px;line-height:25px;font-weight:600">GAIN</div><div style="font-size:17px;line-height:22px;color:var(--label2)">11시</div>')
    s = s.replace('<div style="font-weight:600">페이더</div><div style="font-size:15px;line-height:20px;color:var(--label2)">U 근처</div>',
                  '<div style="font-size:20px;line-height:25px;font-weight:600">페이더</div><div style="font-size:17px;line-height:22px;color:var(--label2)">U 근처</div>')
    s = rep(s, '<div style="font-size:20px;line-height:25px;font-weight:600;margin-top:4px">무선 마이크 켜고 수신기 확인</div>',
               '<div style="font-size:28px;line-height:34px;font-weight:700;margin-top:4px">무선 마이크 켜고 수신기 확인</div>')
    s = rep(s, '<div style="margin-top:8px;font-size:15px;line-height:20px;color:var(--label2)">DFX-12 CH7/8',
               '<div style="margin-top:8px;font-size:17px;line-height:22px;color:var(--label2)">DFX-12 CH7/8')
    s = rep(s, '<section aria-label="지금 할 일" style="background:var(--row);border-radius:18px;padding:16px;',
               '<section aria-label="지금 할 일" style="background:var(--row);border-radius:18px;padding:24px;')
    s = rep(s, '<div style="background:var(--bg);border-radius:12px;padding:12px;text-align:center">', '<div style="background:var(--bg);border-radius:12px;padding:16px;text-align:center">', 2)
    s = s.replace('min-height:44px;padding:0 16px', 'min-height:56px;padding:0 20px')
    if land:
        # two columns: steps list left, current step card right
        s = rep(s, '<main style="flex:1;overflow-y:auto;padding:16px 16px 100px;display:flex;flex-direction:column;gap:16px">',
                   '<main style="flex:1;min-height:0;padding:20px 32px 100px;display:grid;grid-template-columns:360px minmax(0,1fr);grid-template-rows:auto 1fr;gap:16px 24px;align-content:start">')
        s = rep(s, '<div style="background:var(--row);border-radius:18px;overflow:hidden;isolation:isolate">\n      <div style="display:flex;align-items:center;gap:12px;min-height:56px;padding:0 20px"><svg',
                   '<div style="grid-column:1;grid-row:1;background:var(--row);border-radius:18px;overflow:hidden;isolation:isolate">\n      <div style="display:flex;align-items:center;gap:12px;min-height:56px;padding:0 20px"><svg')
        s = rep(s, '<section aria-label="지금 할 일" style="', '<section aria-label="지금 할 일" style="grid-column:2;grid-row:1 / span 2;align-self:start;')
        s = rep(s, '<div style="background:var(--row);border-radius:18px;overflow:hidden;isolation:isolate">\n      <div style="display:flex;align-items:center;gap:12px;min-height:56px;padding:0 20px"><span',
                   '<div style="grid-column:1;grid-row:2;align-self:start;background:var(--row);border-radius:18px;overflow:hidden;isolation:isolate">\n      <div style="display:flex;align-items:center;gap:12px;min-height:56px;padding:0 20px"><span')
    else:
        s = rep(s, '<main style="flex:1;overflow-y:auto;padding:16px 16px 100px;', '<main style="flex:1;overflow-y:auto;padding:20px 32px 100px;')
    s = rep(s, '<nav aria-label="하단 메뉴" style="position:absolute;left:12px;right:12px;bottom:12px;',
               '<nav aria-label="하단 메뉴" style="position:absolute;left:50%;width:480px;margin-left:-240px;bottom:16px;')
    return s

for land in (False, True):
    o = 'L' if land else 'P'
    wr('TabOverview%s.dc.html' % o, overview(land))
    for d in DET: wr('Tab%s%s.dc.html' % (d.capitalize() if d != 'DFX' else 'Dfx', o), detail(d, land))
    wr('TabWiring%s.dc.html' % o, wiring(land))
    wr('TabOperator%s.dc.html' % o, operator(land))
print(sorted(os.listdir(OUT)))
