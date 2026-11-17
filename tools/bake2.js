// node bake2.js file.dc.html  -> rewrites <g id="baked-names">..</g><!--/baked--> in place
const fs=require('fs');const f=process.argv[2];
let t=fs.readFileSync(f,'utf8');
const s=t.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
class DCLogic{constructor(p){this.props=p||{};this.state={};}setState(o){Object.assign(this.state,typeof o==='function'?o(this.state):o)}}
const C=new Function('DCLogic','React','document',s+';return Component;')(DCLogic,{}, {getElementById(){return null}});
const c=new C({});const v=c.renderVals();
const esc=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;');
let o='';
for(const d of (v.textsBake||[])) o+=`<text x="${d.x}" y="${d.y}" font-size="${d.s}" fill="${d.c}" text-anchor="${d.a}" pointer-events="none">${esc(d.t)}</text>`;
for(const k of ['knobs','faders','buttons']) for(const d of (v[k]||[])) if(d.nm&&d.nmx!=null) o+=`<text x="${d.nmx}" y="${d.nmy}" font-size="${d.nmf}" font-weight="700" fill="${process.env.NMC||'#1d1d1f'}" stroke="${process.env.NMS||'#ffffff'}" stroke-width="3" paint-order="stroke" text-anchor="middle" pointer-events="none">${esc(d.nm)}</text>`;
const grp=`<g id="baked-names" font-family="-apple-system,'Noto Sans KR',sans-serif" style="paint-order:stroke">${o}</g><!--/baked-->`;
const re=/<g id="baked-names"[\s\S]*?<\/g><!--\/baked-->/;
if(!re.test(t)) throw new Error('no baked group');
t=t.replace(re,()=>grp);fs.writeFileSync(f,t);console.log('baked',o.length);
