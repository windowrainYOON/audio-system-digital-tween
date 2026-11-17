# 아이콘 (2026-11-17 확정)

## 앱 아이콘 — A · 노브
| 파일 | 용도 |
|---|---|
| `app-icon.svg` | 원본 (100×100 그리드) |
| `icon-1024.png` | 원본 PNG |
| `icon-512.png`, `icon-192.png` | PWA manifest `icons` (`purpose: "any"`) |
| `icon-maskable-512.png` / `app-icon-maskable.svg` | manifest `purpose: "maskable"` (그림을 80% 안전 영역으로 줄임) |
| `apple-touch-icon.png` | iOS 홈 화면 (180×180, 모서리는 iOS가 둥글게 처리) |
| `favicon-32.png`, `favicon-16.png` | 브라우저 탭 |

## 탭바 아이콘
`tab-home.svg`(홈) · `tab-wiring.svg`(배선) · `tab-panel.svg`(패널) · `tab-checks.svg`(점검) · `tab-operate.svg`(운영)
24×24, 선 1.8, `stroke="currentColor"` — 글자색(기본 `--label2`, 선택 `--accent`)을 그대로 따른다. 탭 버튼 안에서 아이콘 위, 글자 아래(간격 2px).
시안 반영: `python3 tools/apply-tab-icons.py` 후 `python3 tools/make-tablet-drafts.py`.
