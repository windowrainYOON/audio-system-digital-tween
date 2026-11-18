import { useEffect, useState } from 'react';
import { Overview } from './screens/Overview';
import { DeviceDetail } from './screens/DeviceDetail';
import { Wiring } from './screens/Wiring';
import { Checks } from './screens/Checks';
import { Operator } from './screens/Operator';
import { TabBar } from './components/TabBar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { readHash } from './nav';
import { startSync } from './store/store';

// 하단 탭바는 모든 화면에 항상 있고, 페이지 이동은 탭바로만 한다(UI_GUIDE 0장 0-1).
export function App() {
  const [{ route, board }, setNav] = useState(readHash);
  useEffect(() => { startSync(); }, []);
  useEffect(() => {
    const f = () => setNav(readHash());
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);

  return (
    <div className="app">
      <ErrorBoundary resetKey={route + board}>
      {route === 'home' && <Overview />}
      {route === 'panel' && <DeviceDetail board={board} />}
      {route === 'wiring' && <Wiring />}
      {route === 'checks' && <Checks />}
      {route === 'ops' && <Operator />}
      </ErrorBoundary>
      <TabBar current={route} />
    </div>
  );
}
