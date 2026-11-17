// M1·M7 상단: 분할 컨트롤(간략 보기 | 상세 보기) + 칩 줄 (시안 MobOverview 그대로)
import { go } from '../nav';
import { useStore } from '../store/store';
import { LABEL } from '../screens/Connection';

export function TopHeader({ full }: { full: boolean }) {
  const net = useStore((s) => s.net);
  return (
    <header className="hdr top">
      <div className="seg">
        <button aria-pressed={!full} onClick={() => go('home')}>간략 보기</button>
        <button aria-pressed={full} onClick={() => go('full')}>상세 보기</button>
      </div>
      <div className="chips">
        <span className="chip primary" aria-label="지금 장면: 주일 예배">주일 예배</span>
        <button className="chip" onClick={() => go('wiring')}>배선 편집</button>
        <button className="chip" onClick={() => go('ops')}>세팅 안내</button>
        <button className={'chip net-' + net} onClick={() => go('ops')} aria-label={'서버 연결: ' + LABEL[net]}><i className="dot" />{LABEL[net]}</button>
      </div>
    </header>
  );
}
