// 화면 하나가 오류로 멈춰도 흰 화면이 되지 않게: 안내 문구와 다시 불러오기 버튼을 보여 준다(탭바는 그대로).
import { Component, type ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode; resetKey: string }, { err: string; key: string }> {
  state = { err: '', key: this.props.resetKey };
  static getDerivedStateFromError(e: Error) { return { err: String(e?.message || e) }; }
  static getDerivedStateFromProps(p: { resetKey: string }, s: { err: string; key: string }) {
    return p.resetKey !== s.key ? { err: '', key: p.resetKey } : null; // 다른 탭으로 가면 다시 시도
  }
  componentDidCatch(e: Error) { console.error(e); }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <main className="main list" role="alert" style={{ paddingTop: 24 }}>
        <section className="card">
          <h2>화면을 그리다 문제가 생겼어요</h2>
          <p className="txt">저장된 값은 그대로 있어요. 다시 불러오면 대부분 해결돼요.</p>
          <p className="break">{this.state.err}</p>
          <button className="btn-primary" onClick={() => location.reload()}>다시 불러오기</button>
        </section>
      </main>
    );
  }
}
