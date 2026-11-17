import re,sys
P='/tmp/claude-0/-home-claude/07643b2d-e495-5baa-b64e-74c939a31f89/scratchpad/twin/project/'
DET='''// SYNC-BEGIN
componentDidMount() {
const self = this; const KEY = 'mixsync:__B__'; let seen = 0; let timer = null;
const apply = (p) => { if (!p || !p.t || p.t <= seen) return; seen = p.t; const o = { vals: Object.assign({}, self.state.vals, p.vals || {}), synced: Object.assign({}, self.state.synced, p.synced || {}) }; if (p.phantom !== undefined && p.phantom !== null) o.phantom = !!p.phantom; self.__cur = { vals: o.vals, synced: o.synced, phantom: o.phantom !== undefined ? o.phantom : self.state.phantom }; self.__raw(o); };
const rd = () => { try { apply(JSON.parse(window.localStorage.getItem(KEY))); } catch (e) {} };
rd(); window.addEventListener('storage', rd); this.__iv = setInterval(rd, 1500);
this.__save = () => { const c = self.__cur || {}; const t = Date.now(); seen = t; const pay = { vals: c.vals || self.state.vals, synced: c.synced || self.state.synced, t: t }; if (c.phantom !== undefined) pay.phantom = !!c.phantom; try { window.localStorage.setItem(KEY, JSON.stringify(pay)); } catch (e) {} clearTimeout(timer); timer = setTimeout(() => { try { if (window.claude && window.claude.use) window.claude.use('db').then((db) => { if (db) db.doc('mixer/__B__').set(pay).catch(() => {}); }).catch(() => {}); } catch (e) {} }, 500); };
try { if (window.claude && window.claude.use) window.claude.use('db').then((db) => { if (db) db.doc('mixer/__B__').onSnapshot((s) => { if (s.exists) apply(s.data()); }, () => {}); }).catch(() => {}); } catch (e) {}
}
componentWillUnmount() { clearInterval(this.__iv); }
// SYNC-END
'''
CTOR='''const __raw = this.setState.bind(this); this.__raw = __raw; this.__cur = { vals: this.state.vals, synced: this.state.synced, phantom: this.state.phantom };
this.setState = (o, cb) => { __raw(o, cb); if (o && typeof o === 'object' && (o.vals || o.synced || o.phantom !== undefined)) { this.__cur = { vals: o.vals || this.__cur.vals, synced: o.synced || this.__cur.synced, phantom: o.phantom !== undefined ? o.phantom : this.__cur.phantom }; if (this.__save) this.__save(); } };
'''
def addid(t,name):
    i=t.index('const %s = defs.filter'%name); j=t.index('return {',i)+len('return {')
    return t[:j]+' id: d.id,'+t[j:]
def do(fn,b):
    t=open(P+fn).read()
    for n in ('knobs','faders','buttons'):
        if 'const %s = defs.filter'%n in t: t=addid(t,n)
    # templates
    t=t.replace('<g onClick="{{k.pick}}"','<g data-cid="{{k.id}}" onClick="{{k.pick}}"')
    t=t.replace('<g onClick="{{f.pick}}"','<g data-cid="{{f.id}}" onClick="{{f.pick}}"')
    t=t.replace('<g onClick="{{b.pick}}"','<g data-cid="{{b.id}}" data-col="{{b.glow}}" onClick="{{b.pick}}"')
    t=t.replace('<line x1="0" y1="{{k.l1}}"','<line data-r="kl" data-x="{{k.x}}" data-y="{{k.y}}" x1="0" y1="{{k.l1}}"')
    t=t.replace('<line x1="0" y1="-3" x2="0" y2="-16"','<line data-r="kl" data-x="{{k.x}}" data-y="{{k.y}}" x1="0" y1="-3" x2="0" y2="-16"')
    # buttons
    t=re.sub(r'(<rect x="\{\{b\.x\}\}" y="\{\{b\.y\}\}" width="\{\{b\.w\}\}" height="\{\{b\.h\}\}" rx="5" fill="none")',r'\1 data-r="bg"',t)
    t=re.sub(r'(<rect x="\{\{b\.x\}\}" y="\{\{b\.y\}\}" width="\{\{b\.w\}\}" height="\{\{b\.h\}\}" rx="[34]" fill="\{\{b\.fill\}\}")',r'\1 data-r="bf"',t)
    t=t.replace('opacity="{{b.onOp}}" pointer-events="none">ON','data-r="bon" opacity="{{b.onOp}}" pointer-events="none">ON').replace('opacity="{{b.offOp}}" pointer-events="none">OFF','data-r="boff" opacity="{{b.offOp}}" pointer-events="none">OFF')
    # faders
    if b=='dfx':
        t=t.replace('<rect x="{{f.cx}}" y="{{f.cy}}"','<rect data-r="fc" data-ya="{{f.ya}}" data-yb="{{f.yb}}" x="{{f.cx}}" y="{{f.cy}}"')
        t=t.replace(" sx: d.x - 2.5,"," ya: d.fb - 26, yb: -(d.fb - d.ft - 26), sx: d.x - 2.5,")
    if b=='l4':
        t=t.replace('<rect x="{{f.hx}}" y="{{f.hy}}"','<rect data-r="fc" data-ya="666" data-yb="-100" x="{{f.hx}}" y="{{f.hy}}"')
        t=t.replace('<circle cx="385" cy="436" r="4" fill="{{phantomFill}}"/>','<circle data-r="ph1" cx="385" cy="436" r="4" fill="{{phantomFill}}"/>').replace('<rect x="{{phantomKnobX}}" y="448"','<rect data-r="ph2" x="{{phantomKnobX}}" y="448"')
    # script
    if '// SYNC-BEGIN' in t: t=re.sub(r'// SYNC-BEGIN.*?// SYNC-END\n','',t,flags=re.S)
    if 'this.__raw' not in t:
        m=re.search(r"this\.state = \{[^\n]*\n",t); t=t[:m.end()]+CTOR+t[m.end():]
    k=t.index('renderVals() {'); t=t[:k]+DET.replace('__B__',b)+t[k:]
    open(P+fn,'w').write(t)
do('MobDfx.dc.html','dfx');do('MobAg06.dc.html','ag');do('MobL4.dc.html','l4')
