// 연결 상태 시트: 우상단 "연결됨" 알약을 누르면 아래에서 올라온다.
// 구글 시트 연결 상태 · 연결 시험(ping → 쓰기 → 읽기) · 데이터 내려받기 (예전 운영 탭의 M0 화면을 옮김).
import { useState } from 'react';
import * as api from '../store/api';
import { exportJson, useStore } from '../store/store';
import { BottomSheet } from '../components/Common';

type Line = { ok: boolean | null; t: string };

export const LABEL = { connecting: '연결 중', online: '연결됨', offline: '끊김 · 마지막 화면', saving: '저장 중' } as const;

export function ConnectionSheet({ onClose }: { onClose: () => void }) {
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
    <BottomSheet label="연결 상태" title="연결 상태" onClose={onClose} className="conn">
      <div className="body">
        <div className="row"><span className="txt" style={{ flex: 1 }}>구글 시트 연결</span>
          <span className="badge" style={{ background: net === 'offline' ? 'var(--warn)' : net === 'online' ? 'var(--ok)' : 'var(--neutral)' }}>{LABEL[net]}</span></div>
        <p className="txt">마지막 동기화: {last ? new Date(last).toLocaleTimeString('ko-KR') : '없음'}</p>
        {err && <p className="txt" style={{ color: '#c4221a' }}>{err}</p>}
        <p className="break">{api.apiUrl()}</p>
        <button className="btn-primary" onClick={run} disabled={busy}>{busy ? '시험 중…' : '연결 시험'}</button>
        {lines.length > 0 && <ul className="log">{lines.map((l, i) => <li key={i} className={l.ok ? 'ok' : 'bad'}>{l.ok ? '✓' : '✗'} {l.t}</li>)}</ul>}
        <button className="btn-fill" onClick={download}>지금 값 JSON 내려받기</button>
      </div>
    </BottomSheet>
  );
}
