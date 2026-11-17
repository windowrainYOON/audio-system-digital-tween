# 중명교회 음향 디지털 트윈

실제 믹서 그림(Mackie DFX-12 · Yamaha AG06 · Zoom L4)을 화면 그대로 보여 주고, 노브·페이더 값과 배선을 모바일 웹에서 기록·확인하는 앱.
아날로그 장비라 값은 사람이 입력하고, 서버 비용은 0원 (GitHub Pages + Google Sheets + Apps Script).

- 인수인계 문서: [docs/HANDOFF.md](docs/HANDOFF.md) ← 새 작업은 여기서 시작
- 시안(디자인 컴포넌트): `design/*.dc.html`, 캔버스 `design/canvas.json`
- 시안 생성 도구: `tools/`
- 서버(Apps Script): `apps-script/Code.gs`
- 앱: `app/` (Vite + React + TS), 데이터는 `node tools/extract-profiles.cjs` 로 시안에서 생성
- 배포 주소: https://windowrainyoon.github.io/audio-system-digital-tween/
