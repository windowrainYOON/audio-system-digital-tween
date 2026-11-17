import re,sys
from playwright.sync_api import sync_playwright
src,out=sys.argv[1],sys.argv[2]
h=open(src).read()
m=re.search(r'<svg viewBox="0 0 358 836".*?</svg>',h,re.S)
svg=m.group(0)
svg=re.sub(r'\{\{r\w+\}\}','0',svg)
svg=re.sub(r'\{\{o\w+\}\}','1',svg)
svg=re.sub(r'onClick="\{\{\w+\}\}"','',svg)
open(out+'.html','w').write('<body style="margin:0;background:#f5f5f7">'+svg)
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':358,'height':836},device_scale_factor=2)
    pg.goto('file://'+out+'.html');pg.screenshot(path=out+'.png');b.close()
