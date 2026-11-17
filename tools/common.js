const fs=require('fs');
function inner(PR,file){
  const t=fs.readFileSync(PR+'/'+file,'utf8');
  const s=t.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
  class DCLogic{constructor(p){this.props=p||{};this.state={};}setState(o){Object.assign(this.state,o)}}
  const C=new Function('DCLogic','React','document',s+';return Component;')(DCLogic,{}, {getElementById(){return null}});
  const c=new C({});c.state.sel={'MobAg06.dc.html':'lb','MobDfx.dc.html':'ph','MobL4.dc.html':'q0'}[file];const v=c.renderVals();
  let svg=t.match(/<svg id="pansvg"[\s\S]*?<\/svg>\s*(?=<div style="height)/)[0];
  const get=(o,p)=>p.split('.').reduce((a,k)=>a==null?a:a[k],o);
  svg=svg.replace(/<sc-for list="\{\{(\w+)\}\}" as="(\w+)"[^>]*>([\s\S]*?)<\/sc-for>/g,(m,l,a,body)=>(v[l]||[]).map(it=>body.replace(/\{\{([\w.]+)\}\}/g,(mm,p)=>{const x=get({[a]:it},p);return x==null?'':x})).join(''));
  svg=svg.replace(/<sc-if[^>]*>|<\/sc-if>/g,'').replace(/\{\{([\w.]+)\}\}/g,(m,p)=>{const x=get(v,p);return typeof x==='function'||x==null?'1':x});
  svg=svg.replace(/ onClick="[^"]*"/g,'').replace(/ id="[^"]*"/g,'').replace(/fill="transparent" stroke="#2DD4BF"/g,'fill="transparent" stroke="transparent"').replace(/stroke="#2DD4BF"/g,'stroke="#555"');
  svg=svg.replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
  svg=svg.replace(/^\s*<rect x="-?\d+" y="-?\d+" width="\d+" height="\d+" fill="#FFFFFF"\/>/,'');
  return svg;
}
// geometry in base units (358 wide). opts.live = interactive wrappers; opts.labels = cable labels
function geo(PR,opts){
  const live=!!opts.live, lab=!!opts.labels;
  const AGs=.26,AGx=0,AGy=84,L4s=.22,L4x=206,L4y=84,DFs=.397,DFx=0,DFy=388;
  const ag=(x,y)=>[AGx+x*AGs,AGy+y*AGs], l4=(x,y)=>[L4x+(x-112)*L4s,L4y+(y-290)*L4s], df=(x,y)=>[DFx+(x-14)*DFs,DFy+y*DFs];
  const nest=(file,cx,cy,cw,ch,x,y,sc)=>`<svg data-b="${({'MobAg06.dc.html':'ag','MobDfx.dc.html':'dfx','MobL4.dc.html':'l4'})[file]}" x="${x}" y="${y}" width="${cw*sc}" height="${ch*sc}" viewBox="${cx} ${cy} ${cw} ${ch}" overflow="hidden">${inner(PR,file)}</svg>`;
  let pics='',cab='',boxes='',labs='';
  const wrapO=(k,s)=>live&&k?`<g opacity="{{o${k}}}">${s}</g>`:s;
  const cable=(key,d,col,dash,lb,lx,ly)=>{ let s=`<path d="${d}" fill="none" stroke="#fff" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/><path d="${d}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"${dash?` stroke-dasharray="${dash}"`:''}/>`; cab+=wrapO(key,s); if(lab&&lb) labs+=`<text x="${lx}" y="${ly}" font-size="5.2" fill="#333" stroke="#fff" stroke-width="2" paint-order="stroke">${lb}</text>`; };
  const sbox=(key,x,y,w,h,t,sub,sub2,f,st)=>{
    let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${f||'#fff'}" stroke="${st||'#9aa0a6'}" stroke-width="1"/><text x="${x+w/2}" y="${y+(h<30?11:14)}" font-size="${t.length>7?7.5:8.5}" font-weight="700" fill="#1d1d1f" text-anchor="middle">${t}</text>`;
    if(sub) s+=`<text x="${x+w/2}" y="${y+(h<30?20:24)}" font-size="6.2" fill="#555" text-anchor="middle">${sub}</text>`;
    if(sub2) s+=`<text x="${x+w/2}" y="${y+32}" font-size="6.2" fill="#555" text-anchor="middle">${sub2}</text>`;
    if(live&&key) s=`<g onClick="{{s${key}}}" role="button" tabindex="0" aria-label="${t}" style="cursor:pointer" opacity="{{o${key}}}">${s}<rect x="${x-3}" y="${y-3}" width="${w+6}" height="${h+6}" rx="9" fill="none" stroke="#0066cc" stroke-width="2.5" opacity="{{rS${key}}}"/></g>`;
    boxes+=s;
  };
  // pictures
  const agBox=[AGx,AGy,602*AGs,770*AGs], l4Box=[L4x,L4y,604*L4s,545*L4s], dfBox=[DFx,DFy,900*DFs,840*DFs];
  const dev=(key,x,y,w,h,content)=>live?`<g onClick="{{p${key}}}" role="button" tabindex="0" aria-label="${key}" style="cursor:pointer" opacity="{{o${key==='Ag'||key==='L4'?key:'X'}}}">${content}<rect x="${x-3}" y="${y-3}" width="${w+6}" height="${h+6}" rx="8" fill="none" stroke="#0066cc" stroke-width="2.5" opacity="{{r${key}}}"/></g>`:content;
  pics+=dev('Ag',...agBox,nest('MobAg06.dc.html',0,0,602,770,AGx,AGy,AGs));
  pics+=dev('L4',...l4Box,nest('MobL4.dc.html',112,290,604,545,L4x,L4y,L4s));
  pics+=dev('Dfx',...dfBox,nest('MobDfx.dc.html',14,0,900,840,DFx,DFy,DFs));
  // sources over AG06 (two staggered rows so each box sits on its own cable)
  sbox('Bs',0,0,56,30,'베이스','DI BOX');
  sbox('Kb',60,0,42,30,'키보드','TRS→TS×2');
  sbox('Gt',34,38,42,30,'기타','DI BOX');
  sbox('Dr',84,38,38,30,'드럼','TS×2→RCA','', '#DDF5EE','#0F766E');
  const A1=ag(110,0)[0],A2=ag(206,0)[0],A3=ag(305,0)[0],A5=ag(402,0)[0];
  cable('Bs',`M${A1} 30 V105.5`,'#444',0,'XLR',A1+2,92);
  cable('Gt',`M${A2} 68 V105.5`,'#444',0,'XLR',A2+2,92);
  cable('Kb',`M${A3} 30 V105.5`,'#6B7280',0,'TS ×2',A3+2,50);
  cable('Dr',`M${A5} 68 V106.5`,'#0F766E',0,'RCA',A5+2,92);
  // CD / PC over L4
  sbox('Cd',206,0,42,40,'CD','RCA→TS','×2');
  sbox('Pc',250,0,52,40,'PC (OBS)','AUX→RCA');
  const c1=l4(160,0)[0],c2=l4(254,0)[0],pw=l4(334,0)[0],pr=l4(358,0)[0];
  cable('Cd',`M${c1} 40 V84`,'#B0B0B0'); cable('Cd',`M${c2} 40 V84`,'#B0B0B0');
  cable('Pc',`M${pw} 40 V84`,'#9a9a9a'); cable('Pc',`M${pr} 40 V84`,'#E0332B');
  // mic sources over DFX: row A (odd) above, row B below
  sbox('Gl',4,302,58,24,'구즈넥 L');
  sbox('M1',66,302,40,24,'매립형 1');
  sbox('M3',110,302,52,24,'매립형 3');
  sbox('Gr',38,332,44,24,'구즈넥 R');
  sbox('M2',88,332,44,24,'매립형 2');
  sbox('Wl',137,332,31,24,'무선');
  const jt=DFy+(68-21)*DFs;
  const mk2=[['Gl',103,326],['Gr',165.5,356],['M1',228,326],['M2',290.5,356],['M3',353,326],['Wl',415.5,356]];
  mk2.forEach(([k,cx,y0])=>cable(k,`M${df(cx,0)[0]} ${y0} V${jt}`,'#444'));
  // AG06 stereo out -> DFX 9/10
  const [ol,olY]=ag(494,108),[or,orY]=ag(554,108);
  const [d1x,d1y]=df(478,123),[d2x,d2y]=df(478,158);
  cable('CAg',`M${ol} ${olY-4} V50 H196 V${d1y} H${d1x+5.8}`,'#B45309','4 3','5.5 TS ×2 (L·R)',150,46);
  cable('CAg',`M${or} ${orY-4} V58 H173 V${d2y} H${d2x-5.8}`,'#B45309','4 3');
  // L4 main out -> DFX CD/TAPE IN
  const [m1x,m1y]=l4(465,362),[m2x,m2y]=l4(465,410),[t1x,t1y]=df(596,134),[t2x,t2y]=df(596,160);
  const rx=l4(530,0)[0];
  cable('CL4',`M${m1x} ${m1y-4.4} V56 H354 V368 H222 V${t1y} H${t1x-4.6}`,'#9a9a9a',0,'RCA ×2 → CD/TAPE IN',226,366);
  cable('CL4',`M${m2x+4.4} ${m2y} H${rx} V62 H348 V360 H217 V${t2y} H${t2x-4.6}`,'#E0332B');
  // DFX outputs
  const [o1x,o1y]=df(752,62),[o2x,o2y]=df(815,62),[p1x,p1y]=df(815,118);
  cable('',`M${o1x} ${o1y-8.4} V396 H352 V760`,'#6B7280',0);
  cable('',`M${o2x} ${o2y-8.4} V402 H346 V760`,'#6B7280');
  cable('',`M${p1x+5.8} ${p1y} H340 V752 H65 V760`,'#6B7280','4 3','PHONES',120,749);
  sbox('',240,760,118,40,'QSC 메인 앰프','MAIN OUT L·R');
  sbox('',0,760,130,40,'MPS1200 서브 앰프','PHONES → 입력');
  cable('',`M268 800 V830`,'#6B7280'); cable('',`M330 800 V830`,'#6B7280'); cable('',`M65 800 V830`,'#6B7280'); cable('',`M268 866 V896`,'#6B7280'); cable('',`M330 866 V896`,'#6B7280');
  sbox('',240,830,56,36,'메인 스피커 L'); sbox('',302,830,56,36,'메인 스피커 R','약함','','#fff','#ff9500');
  sbox('',20,830,90,36,'자모실 스피커','MPS1200');
  sbox('',240,896,56,36,'모니터 L'); sbox('',302,896,56,36,'모니터 R');
  const bd=(x,y,c,t)=>`<g><circle cx="${x}" cy="${y}" r="7" fill="${c}" stroke="#fff" stroke-width="1.5"/><text x="${x}" y="${y+3.2}" font-size="9" font-weight="700" text-anchor="middle" fill="${c==='#ff9500'?'#1d1d1f':'#fff'}">${t}</text></g>`;
  const badges=bd(152,88,'#ff9500','!')+bd(352,392,'#0a84ff','i')+bd(352,762,'#ff9500','!')+bd(124,762,'#ff3b30','×')+bd(352,832,'#ff9500','!');
  const names=`<g font-size="7" font-weight="700" fill="#1d1d1f"><text x="0" y="296">Yamaha AG06</text><text x="206" y="226">MiCWL L4</text><text x="0" y="740">Mackie DFX-12</text></g>`;
  return {pics,cab,boxes,labs,badges,names,H:940};
}
module.exports={inner,geo};
