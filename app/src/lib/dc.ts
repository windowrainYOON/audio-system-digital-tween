// 시안 컴포넌트 로직(data/logic/*.js, 자동 생성)을 React에서 그대로 돌린다.
// 시안의 setState가 불릴 때마다 다시 그린다.
import { useMemo, useReducer } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDesignLogic(create: () => any) {
  const [, bump] = useReducer((n: number) => n + 1, 0);
  const c = useMemo(() => {
    const x = create();
    x.setState = (o: object) => { Object.assign(x.state, o); bump(); };
    return x;
  }, [create]);
  return { c, v: c.renderVals() };
}
