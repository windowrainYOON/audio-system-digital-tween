// 아직 만들지 않은 탭 화면 (M5 배선 편집, 점검). 큰 제목 화면 골격만.
import { TabBar } from '../components/TabBar';
import type { Route } from '../nav';

export function Placeholder({ route, title, text }: { route: Route; title: string; text: string }) {
  return (
    <>
      <div className="bigtitle"><h1>{title}</h1></div>
      <main className="main list">
        <section className="card"><p className="txt">{text}</p></section>
      </main>
      <TabBar current={route} />
    </>
  );
}
