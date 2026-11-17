// Apps Script 웹 앱 호출. 저장소 접근은 이 파일만 한다 (Firebase 등으로 옮길 때 여기만 바꾼다).
// 웹 앱은 리디렉션 후 CORS를 허용하고, POST는 text/plain 이라 사전 요청(preflight)이 없다.
export const DEFAULT_API =
  'https://script.google.com/macros/s/AKfycbwcULUmLqp6r0_wbCXJpV-bVpJXDwopCI4jY0Q7orIElfk1sMG-8jY8qX3rNp4u2aBz8w/exec';

const LS_API = 'twin:api';

export function apiUrl(): string {
  try {
    const q = new URLSearchParams(location.search).get('api');
    if (q) { localStorage.setItem(LS_API, q); return q; }
    return localStorage.getItem(LS_API) || DEFAULT_API;
  } catch { return DEFAULT_API; }
}

export interface Row<T = unknown> { v: T; t: string }

async function call<T>(init: RequestInit | undefined, params: Record<string, string>): Promise<T> {
  const u = new URL(apiUrl());
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 15000);
  try {
    const r = await fetch(u.toString(), { redirect: 'follow', ...init, signal: ctl.signal });
    const text = await r.text();
    let j: { ok?: boolean; error?: string };
    try { j = JSON.parse(text); } catch {
      throw new Error(text.includes('doGet') ? 'Apps Script에 doGet 함수가 없어요 (새 버전으로 다시 배포 필요)' : '응답이 JSON이 아니에요: ' + text.slice(0, 80));
    }
    if (!j.ok) throw new Error(j.error || '알 수 없는 오류');
    return j as T;
  } finally { clearTimeout(timer); }
}

export const ping = () => call<{ ok: true; t: string }>(undefined, { action: 'ping' });
export const getAll = () => call<{ ok: true; data: Record<string, Row> }>(undefined, { action: 'all' });
export const getKey = (key: string) => call<{ ok: true; v: unknown; t: string | null }>(undefined, { action: 'get', key });
export const put = (key: string, v: unknown) =>
  call<{ ok: true; t: string }>({ method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ key, v }) }, {});
