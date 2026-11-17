import { useEffect, useState } from 'react';
import type { BoardId } from './data/types';
import { Overview } from './screens/Overview';
import { DeviceDetail } from './screens/DeviceDetail';
import { Connection, LABEL } from './screens/Connection';
import { startSync, useStore } from './store/store';

type Tab = 'home' | 'panel' | 'conn';
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: '홈', icon: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z' },
  { id: 'panel', label: '패널', icon: 'M5 3v18M12 3v18M19 3v18M3 8h4M10 15h4M17 10h4' },
  { id: 'conn', label: '연결', icon: 'M8 12h8M10 7H7a5 5 0 0 0 0 10h3M14 7h3a5 5 0 0 1 0 10h-3' },
];

function readHash(): { tab: Tab; board: BoardId } {
  const [t, b] = location.hash.replace(/^#\/?/, '').split('/');
  const tab = (['home', 'panel', 'conn'].includes(t) ? t : 'home') as Tab;
  const board = (['ag06', 'dfx12', 'l4'].includes(b) ? b : 'dfx12') as BoardId;
  return { tab, board };
}

export function App() {
  const [{ tab, board }, setNav] = useState(readHash);
  const net = useStore((s) => s.net);
  useEffect(() => { startSync(); }, []);
  useEffect(() => {
    const f = () => setNav(readHash());
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);
  const go = (t: Tab, b: BoardId = board) => { location.hash = '/' + t + (t === 'panel' ? '/' + b : ''); };

  return (
    <div className="app">
      <header className="top">
        <span className="brand">중명교회 음향</span>
        <span className={'net net-' + net} role="status" aria-live="polite"><i />{LABEL[net]}</span>
      </header>
      <main>
        {tab === 'home' && <Overview onOpen={(b) => go('panel', b)} />}
        {tab === 'panel' && <DeviceDetail board={board} onBoard={(b) => go('panel', b)} />}
        {tab === 'conn' && <Connection />}
      </main>
      <nav className="tabbar" aria-label="화면">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} aria-current={tab === t.id ? 'page' : undefined} onClick={() => go(t.id)}>
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={t.icon} /></svg>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
