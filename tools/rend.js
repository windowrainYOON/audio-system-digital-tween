// static renderer for dc.html detail boards: node rend.js file.dc.html out.html
const fs=require('fs');const f=process.argv[2];
const t=fs.readFileSync(f,'utf8');
const s=t.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
class DCLogic{constructor(p){this.props=p||{};this.state={};}setState(o){Object.assign(this.state,typeof o==='function'?o(this.state):o)}}
const C=new Function('DCLogic','React','document',s+';return Component;')(DCLogic,{}, {getElementById(){return null}});
const c=new C({});const v=c.renderVals();
let svg=t.match(/<svg id="pansvg"[\s\S]*?<\/svg>\s*(?=<div style="height)/)[0];
const get=(o,p)=>p.split('.').reduce((a,k)=>a==null?a:a[k],o);
function expand(str,ctx){
  // sc-for expansion (non-nested)
  str=str.replace(/<sc-for list="\{\{(\w+)\}\}" as="(\w+)"[^>]*>([\s\S]*?)<\/sc-for>/g,(m,l,a,body)=>(v[l]||[]).map(it=>body.replace(/\{\{([\w.]+)\}\}/g,(mm,p)=>{const x=get({[a]:it},p);return x==null?'':x})).join(''));
  str=str.replace(/\{\{([\w.]+)\}\}/g,(m,p)=>{const x=get(v,p);return typeof x==='function'||x==null?'1':x});
  return str;
}
svg=expand(svg).replace(/ onClick="[^"]*"/g,'');
const vb=svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
svg=svg.replace(/width="\d+" height="\d+"/,`width="${vb[2]*1.4}" height="${vb[3]*1.4}"`);
fs.writeFileSync(process.argv[3],'<body style="margin:0;background:#fff">'+svg);
