// 하단 탭바: 홈 · 배선 · 패널 · 점검 · 운영 (시안 M5·M6)
import { go, type Route } from '../nav';

const TABS: [Route, string][] = [['home', '홈'], ['wiring', '배선'], ['panel', '패널'], ['checks', '점검'], ['ops', '운영']];

export function TabBar({ current }: { current: Route }) {
  return (
    <nav className="tabbar" aria-label="하단 메뉴">
      {TABS.map(([r, l]) => (
        <button key={r} aria-current={current === r ? 'page' : undefined} onClick={() => go(r)}>{l}</button>
      ))}
    </nav>
  );
}
