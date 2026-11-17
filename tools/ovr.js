const fs=require('fs');const t=fs.readFileSync(process.argv[2],'utf8');
const s=t.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
class D{constructor(p){this.props=p;this.state={}}setState(o){Object.assign(this.state,o)}}
const C=new Function('DCLogic',s+';return Component;')(D);const c=new C({});
c.state.src=process.argv[3]||'';const v=c.renderVals();
let svg=t.slice(t.indexOf('<svg viewBox="0 0 358 940"'),t.indexOf('</main>'));svg=svg.slice(0,svg.lastIndexOf('</svg>')+6);
svg=svg.replace(/ onClick="[^"]*"/g,'').replace(/\{\{(\w+)\}\}/g,(m,k)=>v[k]==null?'':v[k]);
fs.writeFileSync(process.argv[4],'<body style="margin:0;background:#f5f5f7">'+svg);
