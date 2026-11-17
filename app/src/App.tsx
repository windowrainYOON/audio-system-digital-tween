import { useEffect, useState } from 'react';
import { Overview } from './screens/Overview';
import { FullWiring } from './screens/FullWiring';
import { DeviceDetail } from './screens/DeviceDetail';
import { Connection } from './screens/Connection';
import { Placeholder } from './screens/Placeholder';
import { Wiring } from './screens/Wiring';
import { readHash } from './nav';
import { startSync } from './store/store';

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
      {route === 'home' && <Overview />}
      {route === 'full' && <FullWiring />}
      {route === 'panel' && <DeviceDetail board={board} />}
      {route === 'wiring' && <Wiring />}
      {route === 'checks' && <Placeholder route="checks" title="점검" text="점검 결과는 별도 목록 없이 믹서 그림 위 배지(!)로 보여줘요. 홈에서 배지가 붙은 장비를 눌러 보세요." />}
      {route === 'ops' && <Connection />}
    </div>
  );
}
