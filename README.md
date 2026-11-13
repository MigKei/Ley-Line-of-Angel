# Ley Line of Angel · 천사맥(天使脈)

GitHub Pages에 그대로 올려 공개할 수 있는 정적 웹게임 프로젝트예요. 플레이어는 공개된 웹 주소에 접속하기만 하면 돼요. 플레이어 측 Python 설치, BAT 실행, 게임 파일 다운로드는 필요하지 않아요.

## GitHub Pages 공개 방법

1. 이 폴더 안의 파일 전체를 GitHub 저장소의 최상위(root)에 올려요.
2. 저장소의 **Settings → Pages**로 이동해요.
3. **Build and deployment → Source**에서 **Deploy from a branch**를 선택해요.
4. Branch는 `main`, 폴더는 `/ (root)`로 지정하고 저장해요.
5. GitHub Pages가 공개한 URL에 접속하면 게임이 실행돼요.

이 프로젝트는 HTML, CSS, JavaScript 모듈만 사용하는 정적 사이트예요. 서버 코드나 빌드 과정이 필요하지 않아요. 저장소의 폴더 구조와 파일 경로를 그대로 유지해 주세요. `.nojekyll` 파일도 루트에 포함되어 있어요.

공개 설정과 브랜치 배포 절차는 [GitHub Pages 공식 문서](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)를 참고할 수 있어요.

## 언어 설정

- 첫 화면은 일본어예요.
- 화면 오른쪽 위의 언어 전환 버튼으로 일본어와 한국어를 바꿀 수 있어요.
- 진행 중인 언어 설정은 JSON 세이브 파일에도 저장돼요.

## 저장 방식

게임 안의 `JSON 저장` 버튼으로 진행 상황을 파일에 저장하고, `JSON 불러오기` 버튼으로 복원해요. 브라우저 저장 공간에는 게임 진행 상황을 자동 저장하지 않아요.

저장 파일에는 현재 위치, 방문·조사한 장소, 소지품, 아이템 조사 여부, 현장 기록, 조건부 기록, 언어 설정이 포함돼요. 기존 `cheonsamaek-save` 형식도 불러올 수 있도록 호환 처리를 유지했어요.

## 파일 구조

```text
Ley-Line-of-Angel/
├── index.html
├── .nojekyll
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── core/
│   │   ├── gameState.js
│   │   ├── i18n.js
│   │   └── journal.js
│   ├── data/
│   │   ├── locations.js
│   │   ├── items.js
│   │   └── researchRecords.js
│   ├── systems/
│   │   ├── navigation.js
│   │   ├── investigation.js
│   │   ├── ending.js
│   │   ├── research.js
│   │   └── saveManager.js
│   └── ui/
│       ├── render.js
│       └── dom.js
├── tests/
│   └── game.test.js
└── package.json
```

## 콘텐츠를 수정하는 파일

| 수정할 내용 | 파일 |
|---|---|
| 장소의 한국어 설명과 이동 경로 | `js/data/locations.js` |
| 장소의 일본어 설명 | `js/core/i18n.js` 안의 `JA_LOCATIONS` |
| 아이템의 한국어 설명 | `js/data/items.js` |
| 아이템의 일본어 설명 | `js/core/i18n.js` 안의 `JA_ITEMS` |
| 화면 메뉴와 안내 문구 번역 | `js/core/i18n.js` 안의 `UI` |
| 생태 조사 기록의 본문과 해금 조건 | `js/data/researchRecords.js` |
| 화면 디자인 | `css/style.css` |

## 생태 조사 기록 작성법

현장 기록은 장소나 아이템을 조사할 때마다 자동으로 쌓이는 발견 로그예요. 이와 별도로 `생태 기록` 메뉴는 주인공이 조사 결과를 종합해 작성하는 연구 노트예요.

생태 기록은 필수 조사 장소 13곳의 조사 완료 수와 아이템 2종의 개별 조사 완료 수에 따라 단계적으로 열려요. 현재 초안의 해금 조건은 다음과 같아요.

| 기록 | 장소 조사 | 아이템 개별 조사 |
|---|---:|---:|
| 01 | 3 / 13 | 0 / 2 |
| 02 | 6 / 13 | 1 / 2 |
| 03 | 9 / 13 | 1 / 2 |
| 04 | 13 / 13 | 2 / 2 |

본문은 `js/data/researchRecords.js`에서 작성해요. 한국어와 일본어 문장을 각각 넣으면 화면 언어에 맞춰 표시돼요.

```js
{
  id: 'ecology_01',
  title: { ko: '생태 조사 기록 01', ja: '生態調査記録 01' },
  unlock: { locations: 3, items: 0 },
  body: {
    ko: '한국어 기록 내용',
    ja: '日本語の記録本文'
  }
}
```

본문을 비워 두면 해금 조건을 충족해도 '본문 미작성' 안내가 나와요. 제목과 해금 조건도 같은 파일에서 수정할 수 있어요.

## 개발용 테스트

`npm test`는 제작자가 개발 환경에서 게임 로직을 확인할 때만 사용하는 선택 기능이에요. Node.js가 필요하지만, 플레이어에게는 필요하지 않아요.

개발 중 브라우저에서 미리 보려면 VS Code의 Live Server 같은 정적 파일 서버를 사용할 수 있어요. 이것도 제작자용 미리보기 방법이고, 공개된 GitHub Pages에서는 주소 접속만으로 실행돼요.
