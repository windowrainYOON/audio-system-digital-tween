# 인수인계 (2026-11-17 기준)

새 세션에서 이 문서 + 아래 링크 두 개를 읽고 시작하세요. 사용자는 한국어로 대화합니다.

## 1. 한 줄 요약
교회 음향 시스템(DFX-12, AG06, L4, 매립/무선 마이크, QSC·MPS 앰프, 스피커·모니터)의 모바일 웹 디지털 트윈. Apple HIG 스타일, 실제 믹서 도면이 메인 화면, 유지비 0원.

> **UI를 만들 때는 반드시 `docs/UI_GUIDE.md`를 먼저 읽으세요.** 시안과 사용자 요구가 정리돼 있습니다.

## 2. 링크
| 항목 | 주소 |
|---|---|
| 시안 캔버스(M1~M7) | https://claude.ai/artifact/71UHP6YnnwUcrze2apQtFu |
| 기능 명세서 | https://claude.ai/artifact/9KErfNfunVGja9xz9bjEjy |
| 개발 전략 문서 (10장 폴더 구조, 11장 할 일) | https://claude.ai/artifact/EA45L1oqowh88BGM3cni6v |
| 구글 시트 | https://docs.google.com/spreadsheets/d/1GPNf261lSkupUtFzMQdMNDaDas5Wh24ZyxB56F2Ajus/edit |
| Apps Script 편집기 | https://script.google.com/d/1NJ9S2I0QVv6otSEgBPiHNnQG363t7lM1U687YbjasS_dsqtAkKFk9vJ3/edit |
| Apps Script 웹 앱 | https://script.google.com/macros/s/AKfycbwcULUmLqp6r0_wbCXJpV-bVpJXDwopCI4jY0Q7orIElfk1sMG-8jY8qX3rNp4u2aBz8w/exec |
| 저장소 | https://github.com/windowrainYOON/audio-system-digital-tween |

## 3. 확정된 결정
- 접근: URL만 알면 누구나 (로그인 없음). 연결이 끊기면 **마지막 화면 유지**, 재연결 시 최신 값 로드.
- 착수 조건: 시트·스크립트·GitHub 연결 확인 후 M0 시작.
- 아날로그 장비 → 값은 수동 입력. 노브/페이더 보정 실측(약 10점)은 **나중에**(할 일 4번, 보류).
- 케이블 규칙: 키보드 = TRS 출력 → TS 2개 → AG06 3/4(L·R). 드럼 = TS 모노 2개 → RCA → AG06 5/6. 소스는 합치지 않고 개별로 그림(베이스, 기타, 키보드, 드럼, 구즈넥 L/R, 매립형 1/2/3, 무선, CD, PC).
- 배선 그림은 겹치거나 교차하지 않게 (도면·앱 모두).
- 전체 배선도(M7)와 간략 보기(M1)는 **같은 믹서 그림과 같은 케이블 배치**를 공유.
- 상세 화면에서 노브·페이더를 바꾸면 M1/M7 믹서 그림에도 반영 (공유 상태).

## 4. 시안 구조 (`design/`)
M1 MobOverview · M2 MobL4 · M3 MobDfx · M4 MobAg06 · M5 MobWiring · M6 Mobile · M7 System.
`.dc.html` = Design Component 런타임(`<x-dc>`, `class Component extends DCLogic`, `renderVals()`).
- 공유 상태: 상세 보드가 `localStorage['mixsync:ag|dfx|l4']` = `{vals, synced, phantom, t}`에 저장하고, 가능하면 db 문서 `mixer/<board>`에도 쓴다(500ms 디바운스). M1/M7은 storage 이벤트·1.5초 폴링·onSnapshot으로 읽어 `svg[data-b] [data-cid]`, `[data-r]` 속성을 갱신.
- 값 공식: 노브 `rotate(-135+270*v)`, 페이더 `y = ya + yb*v`, 버튼 on = `v===1`.
- 지오메트리: AG06 ×.26 @(0,84), L4 ×.22 @(206,84), DFX ×.397 @(0,388). 상세는 `tools/common.js`.
- 이 `.dc.html`은 **시안**이다. 실제 앱은 전략 문서 10장의 구조(React+Vite+TS, `src/data/*.json` 프로파일, 컴포넌트 Panel/Knob/Fader/Button/Jack/Cable)로 새로 만든다. 시안의 SVG 도면과 좌표·공식을 데이터로 옮기는 것이 M0~M1의 핵심.

## 5. 도구 (`tools/`)
`common.js`(도면 조각·지오메트리), `ov.js`(M1 SVG 재생성), `sys2.js`(M7 생성), `ovr.js`(M1 로컬 렌더), `bake2.js`(정적 굽기), `sync.py`(공유 상태 코드 주입), `viewer.txt`(M1/M7 패치 코드), `t.js`(renderVals 스모크 테스트). 파이프라인 경로가 이전 작업 폴더(`.../scratchpad/twin`)로 하드코딩돼 있어 새 환경에선 경로 수정 필요. 아티팩트 게시는 새 세션에서 Artifact 도구로.

## 6. 현재 상태
- 완료: 시안 M1~M7, 명세서·전략 문서 갱신, 시트/스크립트/저장소 존재 확인.
- **Apps Script**: 웹 앱 배포 URL은 열린다(익명 접근 가능). 단, 마지막 확인 때 "Script function not found: doGet"이 나왔다(`apps-script/Code.gs`를 붙여 넣고 새 버전 배포한 직후였고, 캐시일 수 있음). **새 세션 첫 작업: `?action=ping`으로 `{"ok":true,...}`가 오는지 확인.** 안 되면 편집기에서 Code.gs 내용·"배포 관리 → 새 버전" 여부 확인.
- 시트: 탭 "시트1"만 있음. `Code.gs`가 첫 쓰기 때 `state`, `changelog` 탭을 만든다. 링크가 있는 누구나 편집 가능 상태 → 편집자를 본인으로 제한하고 앱은 Apps Script로만 쓰게 하는 것을 권장(사용자 미결정).
- 저장소: 공개, 초기 커밋만 있음. GitHub Pages는 아직 설정 안 됨(Settings → Pages 확인 필요).
- 이 세션 샌드박스는 script.google.com / github.io에 직접 접속이 막혀 있어 WebFetch/브라우저로만 확인했다.

## 6.1 M0 진행 (2026-11-17, 두 번째 세션)
- 앱 골격: `app/` (Vite 6 + React 18 + TS). `npm run dev | build | test` (app 폴더에서).
- 프로파일: `node tools/extract-profiles.cjs` 가 시안(MobAg06/MobDfx/MobL4/MobOverview)을 실행해 `app/src/data/profiles/{ag06,dfx12,l4}.json`, `app/src/data/overview.json` 을 만든다. 손으로 고치지 말고 시안을 고친 뒤 다시 돌린다.
  - `art` = 값과 무관한 정적 도면(SVG 조각), `controls` = 노브·페이더·버튼 좌표·모양·기본값, `flows` = 신호 흐름 문구.
- 화면: 홈(M1 간략 보기, 소스 탭 → 경로 강조), 패널(상세 최소판: 탭 → 슬라이더/토글, "실물에 맞췄어요"), 연결(Apps Script ping → test/ping 쓰기 → 읽기 시험, JSON 내려받기).
- 공유 상태: `app/src/store/store.ts`. 시트 키 `mixer/<ag06|dfx12|l4>` = `{vals, synced, phantom, t}`, 300ms 디바운스 저장, 4초 폴링(화면 켜져 있을 때만), 브라우저에 마지막 값 캐시 → 끊겨도 마지막 화면 유지. 시트 접근은 `store/api.ts` 한 파일. `?api=<웹앱 URL>` 로 주소 바꿀 수 있음.
- 배포: `.github/workflows/deploy.yml` (main push 시 빌드·테스트 → Pages). **Settings → Pages → Source를 "GitHub Actions"로 바꿔야 배포된다.** 주소: https://windowrainyoon.github.io/audio-system-digital-tween/
- 이 클라우드 환경은 script.google.com 접속이 막혀 있어 Apps Script 시험은 배포된 앱의 "연결" 탭에서 한다.

## 6.2 M0 완료 · M1 진행 (2026-11-17)
- PR #1 머지, Pages 배포됨. 사용자가 폰에서 연결 시험(ping·쓰기·읽기) 모두 통과 확인.
- 결정: 구글 시트는 지금처럼 링크 있는 누구나 편집 유지.
- M1 상세: 컨트롤을 누르면 패널에 신호 흐름 점선(`lib/flow.ts`), 아래 인스펙터(`components/Inspector.tsx`)에 같은 모양 큰 노브(돌리기)·페이더(끌기), −/+ 0.05 단계, 눈금 숫자 직접 입력, 설명(desc·연결, 기본 접힘). 설명 문구는 추출기가 시안 selInfo에서 가져온다. 값에 따라 바뀌는 "조작하면 어떻게 되나" 문구(eff)는 아직 안 옮김.

## 7. 다음 할 일 (M0)
1. Apps Script ping/읽기/쓰기 시험 (state 탭에 시험 키 기록 → 읽기).
2. 시트 편집자 제한 여부 결정.
3. 저장소에 Vite+React+TS 골격 + GitHub Actions 배포(`.github/workflows/deploy.yml`), Pages 켜기.
4. `src/data/profiles/{dfx12,ag06,l4}.json` — 시안의 도면·좌표·공식을 데이터로.
5. Overview(M1) 화면부터 구현 → 상세 → 전체 배선도 → 배선 편집 → 운영자 화면.
6. 오프라인/연결 끊김 시 마지막 화면 유지 동작.
7. (보류) 노브·페이더 보정 실측.

## 8. 알아둘 점
- 사용자는 "아티팩트 업데이트 허락 묻지 말고 자동으로"를 원한다.
- 사용자가 소스를 합쳐 그리는 것에 강하게 반대했다(배선도에 하나씩 그린 데는 이유가 있음). 항상 소스별 개별 표시.
- 미검증: 라이브 뷰어에서 보드 iframe 안의 `window.claude`/db 동작, 실제 탭·핀치 동작(로컬 Playwright 렌더만 확인), M1/M7에서 "미동기화" 앰버 점 미표시, `canvas.json`의 M7 프레임 크기(1500×1400)가 새 콘텐츠(800×2170)와 불일치.

## 9. 새 세션 첫 메시지 (복사해서 사용)
```
중명교회 음향 디지털 트윈 프로젝트를 이어서 진행해요.
먼저 저장소 windowrainYOON/audio-system-digital-tween 의 docs/HANDOFF.md 와 docs/UI_GUIDE.md 를 읽고,
거기 적힌 명세서·전략 문서·캔버스 링크를 확인한 뒤 "7. 다음 할 일(M0)"부터 시작해 주세요.
```
