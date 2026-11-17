const fs=require('fs');const {geo}=require('./common.js');
const PR=process.argv[2];
const g=geo(PR,{live:true});
const svg=`<svg viewBox="0 0 358 940" width="358" height="940" role="group" aria-label="전체 장비 간략 보기" font-family="Noto Sans KR, sans-serif">${g.cab}${g.pics}${g.boxes}${g.badges}${g.names}</svg>`;
let h=fs.readFileSync(PR+'/MobOverview.dc.html','utf8');
const a=h.indexOf('<svg viewBox="0 0 358'); const b=h.indexOf('</svg>\n  </main>');
if(a<0||b<0) throw new Error('svg not found');
// outermost svg end: the last </svg> before </main>
const end=h.indexOf('</main>');
const lastSvg=h.lastIndexOf('</svg>',end)+6;
h=h.slice(0,a)+svg+h.slice(lastSvg);
fs.writeFileSync(PR+'/MobOverview.dc.html',h);console.log('ok',svg.length);
