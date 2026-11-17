// 중명교회 음향 디지털 트윈 — Apps Script (연결 시험용 v0)
// 시트: Audio System Digital Tween
const SHEET_ID = '1GPNf261lSkupUtFzMQdMNDaDas5Wh24ZyxB56F2Ajus';
const STATE = 'state';   // 열: key | json | updated
const LOG = 'changelog'; // 열: time | key | json

function sh_(name, header) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let s = ss.getSheetByName(name);
  if (!s) { s = ss.insertSheet(name); s.appendRow(header); }
  return s;
}
function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// 읽기: ?action=ping | ?action=get&key=mixer/ag06 | ?action=all
function doGet(e) {
  const a = (e && e.parameter && e.parameter.action) || 'ping';
  try {
    if (a === 'ping') return out_({ ok: true, t: new Date().toISOString() });
    const rows = sh_(STATE, ['key', 'json', 'updated']).getDataRange().getValues().slice(1);
    if (a === 'all') {
      const all = {};
      rows.forEach(r => { all[r[0]] = { v: JSON.parse(r[1] || 'null'), t: r[2] }; });
      return out_({ ok: true, data: all });
    }
    if (a === 'get') {
      const r = rows.find(r => r[0] === e.parameter.key);
      return out_({ ok: true, v: r ? JSON.parse(r[1] || 'null') : null, t: r ? r[2] : null });
    }
    return out_({ ok: false, error: 'unknown action' });
  } catch (err) { return out_({ ok: false, error: String(err) }); }
}

// 쓰기: POST (Content-Type: text/plain) 본문 {"key":"mixer/ag06","v":{...}}
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const b = JSON.parse(e.postData.contents);
    if (!b.key) return out_({ ok: false, error: 'key required' });
    const s = sh_(STATE, ['key', 'json', 'updated']);
    const now = new Date().toISOString();
    const keys = s.getRange(1, 1, s.getLastRow(), 1).getValues().map(r => r[0]);
    const i = keys.indexOf(b.key);
    const js = JSON.stringify(b.v);
    if (i > 0) s.getRange(i + 1, 2, 1, 2).setValues([[js, now]]);
    else s.appendRow([b.key, js, now]);
    sh_(LOG, ['time', 'key', 'json']).appendRow([now, b.key, js]);
    return out_({ ok: true, t: now });
  } catch (err) { return out_({ ok: false, error: String(err) }); }
  finally { lock.releaseLock(); }
}
