// 믹서 한 대의 그림: 시안에서 옮긴 정적 도면(art) + 데이터로 그리는 컨트롤.
// 간략 보기·전체 배선도·상세 화면이 모두 이 컴포넌트와 같은 상태를 쓴다.
import { memo } from 'react';
import type { BoardState, Profile } from '../data/types';
import type { FlowDraw } from '../lib/flow';
import { Button, Fader, Knob } from './Controls';

const Art = memo(function Art({ html }: { html: string }) {
  return <g dangerouslySetInnerHTML={{ __html: html }} />;
});

interface Props { profile: Profile; state: BoardState; selected?: string; onPick?: (id: string) => void; showUnsynced?: boolean; flow?: FlowDraw | null }

export function PanelLayer({ profile, state, selected, onPick, showUnsynced = true, flow }: Props) {
  const ph = profile.phantom;
  return (
    <g>
      <Art html={profile.art} />
      {ph && (
        <g aria-label={state.phantom ? '+48V 켜짐' : '+48V 꺼짐'}>
          <circle cx={ph.lamp.cx} cy={ph.lamp.cy} r={ph.lamp.r} fill={state.phantom ? ph.lamp.on : ph.lamp.off} />
          <rect x={state.phantom ? ph.knob.xOn : ph.knob.xOff} y={ph.knob.y} width={ph.knob.w} height={ph.knob.h} rx={2} fill="#E8E8E8" />
        </g>
      )}
      {profile.controls.map((c) => {
        const v = state.vals[c.id] ?? c.def;
        const p = { v, sel: selected === c.id, unsynced: showUnsynced && state.synced[c.id] === false, onPick };
        if (c.type === 'knob') return <Knob key={c.id} d={c} {...p} />;
        if (c.type === 'fader') return <Fader key={c.id} d={c} {...p} />;
        return <Button key={c.id} d={c} {...p} />;
      })}
      {flow && (
        <g pointerEvents="none" aria-hidden="true">
          <path d={flow.d} fill="none" stroke="#14B8A6" strokeWidth={5} strokeLinecap="round" strokeDasharray="2 9" />
          {flow.dots.map((o, i) => <circle key={i} cx={o.x} cy={o.y} r={o.r} fill="none" stroke="#14B8A6" strokeWidth={4} />)}
          <polygon points={flow.arrow} fill="#14B8A6" stroke="#FFFFFF" strokeWidth={1.5} />
        </g>
      )}
    </g>
  );
}

export function Panel(props: Props & { label: string; width?: number }) {
  const [x, y, w, h] = props.profile.viewBox;
  return (
    <svg viewBox={`${x} ${y} ${w} ${h}`} width={props.width ?? '100%'} height={props.width ? (props.width * h) / w : undefined} role="group" aria-label={props.label}
      style={{ display: 'block', fontFamily: 'Noto Sans KR, sans-serif' }}>
      <PanelLayer {...props} />
    </svg>
  );
}
