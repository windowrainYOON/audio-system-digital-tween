// M0 연결 시험: Apps Script ping → state 탭에 시험 키 쓰기 → 다시 읽기. 결과를 그대로 보여준다.
import { useState } from 'react';
import * as api from '../store/api';
import { exportJson, useStore } from '../store/store';

type Line = { ok: boolean | null; t: string };

export function Connection() {
  const net = useStore((s) => s.net);
  const err = useStore((s) => s.error);
  const last = useStore((s) => s.lastSync);
  const [lines, setLines] = useState<Line[]>([]);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    const out: Line[] = [];
    const add = (l: Line) => { out.push(l); setLines([...out]); };
    const step = async (name: string, f: () => Promise<string>) => {
      const t0 = performance.now();
      try { const m = await f(); add({ ok: true, t: `${name}: ${m} (${Math.round(performance.now() - t0)}ms)` }); return true; }
      catch (e) { add({ ok: false, t: `${name}: ${(e as Error).message}` }); return false; }
    };
    const nonce = Math.random().toString(36).slice(2, 8);
    if (await step('1. ping', async () => (await api.ping()).t)) {
      if (await step('2. 쓰기 test/ping', async () => (await api.put('test/ping', { nonce, at: new Date().toISOString() })).t)) {
        await step('3. 읽기 test/ping', async () => {
          const r = await api.getKey('test/ping');
          const got = (r.v as { nonce?: string } | null)?.nonce;
          if (got !== nonce) throw new Error(`값이 달라요 (보낸 ${nonce}, 받은 ${got})`);
          return `같은 값 확인 (${nonce})`;
        });
      }
    }
    setBusy(false);
  }

  function download() {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([exportJson()], { type: 'application/json' }));
    a.download = 'twin-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
  }

  return (
    <div className="screen pad">
      <h1>연결</h1>
      <section className="card">
        <div className="row"><div className="title">구글 시트 (Apps Script)</div><span className={'pill net-' + net}>{LABEL[net]}</span></div>
        <p className="muted">마지막 동기화: {last ? new Date(last).toLocaleTimeString('ko-KR') : '없음'}</p>
        {err && <p className="err">{err}</p>}
        <p className="muted small break">{api.apiUrl()}</p>
      </section>
      <section className="card">
        <div className="title">연결 시험</div>
        <p className="muted">ping → state 탭에 시험 키(test/ping) 쓰기 → 다시 읽어 같은 값인지 확인해요.</p>
        <button className="primary" onClick={run} disabled={busy}>{busy ? '시험 중…' : '시험 시작'}</button>
        <ul className="log">{lines.map((l, i) => <li key={i} className={l.ok ? 'ok' : 'bad'}>{l.ok ? '✓' : '✗'} {l.t}</li>)}</ul>
      </section>
      <section className="card">
        <div className="title">데이터 내려받기</div>
        <p className="muted">지금 값 전체를 JSON 파일로 저장해요.</p>
        <button className="secondary" onClick={download}>JSON 내려받기</button>
      </section>
    </div>
  );
}

export const LABEL = { connecting: '연결 중', online: '연결됨', offline: '끊김 · 마지막 화면', saving: '저장 중' } as const;
