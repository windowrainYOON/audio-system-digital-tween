import sys
from playwright.sync_api import sync_playwright
src,out=sys.argv[1],sys.argv[2]
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
    msgs=[]
    pg.on('console',lambda m:msgs.append(m.text)); pg.on('pageerror',lambda e:msgs.append(str(e)))
    pg.goto('file://'+src);pg.wait_for_timeout(1500)
    pg.screenshot(path=out);print(msgs[:5]);b.close()
