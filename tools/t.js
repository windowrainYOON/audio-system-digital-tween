const fs=require('fs');const t=fs.readFileSync(process.argv[2],'utf8');
const s=t.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
class D{constructor(p){this.props=p;this.state={}}setState(o){Object.assign(this.state,o)}}
const C=new Function('DCLogic',s+';return Component;')(D);const c=new C({});
const v=c.renderVals();console.log(v.oDi,v.oX,v.hasFlow);
c.state.src='Kb';const w=c.renderVals();console.log(w.oDi,w.oKb,w.oCAg,w.oAg,w.oDfx,JSON.stringify(w.flow).slice(0,200));
