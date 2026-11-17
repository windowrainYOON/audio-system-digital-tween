// 하단 탭바: 홈 · 배선 · 패널 · 점검 · 운영 (시안 M5·M6). 아이콘 원본 design/icons/tab-*.svg (24px, 선 1.8, currentColor).
import { go, type Route } from '../nav';

const ICON: Record<string, JSX.Element> = {
  home: <><path d="M4 11 L12 4 L20 11" /><path d="M6 9.5 V20 H18 V9.5" /><path d="M10 20 v-5 h4 v5" /></>,
  wiring: <><rect x="2.5" y="4" width="5" height="6" rx="1.2" /><path d="M5 10 v3 q0 6 7 6 q7 0 7 -6 v-3" /><rect x="16.5" y="4" width="5" height="6" rx="1.2" /><path d="M4 4 V2 M6 4 V2 M18 4 V2 M20 4 V2" /></>,
  panel: <><path d="M6 3 V21 M12 3 V21 M18 3 V21" /><rect x="3.5" y="13" width="5" height="3.5" rx="1" /><rect x="9.5" y="6" width="5" height="3.5" rx="1" /><rect x="15.5" y="10" width="5" height="3.5" rx="1" /></>,
  checks: <><circle cx="11" cy="11" r="7" /><path d="M16 16 L21 21" /><path d="M8 11 l2 2 l4 -4" /></>,
  ops: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4 V2.8 h6 V4" /><path d="M8.5 10 l1.5 1.5 l3 -3" /><path d="M8.5 16 h7" /></>,
};
const TABS: [Route, string][] = [['home', '홈'], ['wiring', '배선'], ['panel', '패널'], ['checks', '점검'], ['ops', '운영']];

export function TabBar({ current }: { current: Route }) {
  return (
    <nav className="tabbar" aria-label="하단 메뉴">
      {TABS.map(([r, l]) => (
        <button key={r} aria-current={current === r ? 'page' : undefined} onClick={() => go(r)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICON[r]}</svg>
          <span>{l}</span>
        </button>
      ))}
    </nav>
  );
}
