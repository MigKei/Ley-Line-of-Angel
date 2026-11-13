// 生態調査記録 / 생태 조사 기록
// 아래 body의 ko, ja에 본문을 추가하면 조건을 충족했을 때 게임 안에서 열려요.
// locations는 필수 조사 장소 13곳 중 조사 완료 수, items는 2개 아이템 중 개별 조사 완료 수예요.
export const RESEARCH_RECORDS = [
  {
    id: 'ecology_01',
    title: { ko: '생태 조사 기록 01', ja: '生態調査記録 01' },
    unlock: { locations: 3, items: 0 },
    body: { ko: '', ja: '' }
  },
  {
    id: 'ecology_02',
    title: { ko: '생태 조사 기록 02', ja: '生態調査記録 02' },
    unlock: { locations: 6, items: 1 },
    body: { ko: '', ja: '' }
  },
  {
    id: 'ecology_03',
    title: { ko: '생태 조사 기록 03', ja: '生態調査記録 03' },
    unlock: { locations: 9, items: 1 },
    body: { ko: '', ja: '' }
  },
  {
    id: 'ecology_04',
    title: { ko: '생태 조사 기록 04', ja: '生態調査記録 04' },
    unlock: { locations: 13, items: 2 },
    body: { ko: '', ja: '' }
  }
];
