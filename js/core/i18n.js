import { LOCATIONS } from '../data/locations.js';
import { ITEMS } from '../data/items.js';

export const DEFAULT_LANGUAGE = 'ja';

const UI = {
  ja: {
    subtitle: '廃墟となった村の現地調査記録', menuLabel: '記録メニュー',
    tabField: '現地', tabMap: '地図', tabInventory: '所持品', tabJournal: '調査記録', tabResearch: '生態記録',
    switchLanguage: '한국어',
    save: 'JSON保存', load: 'JSON読込', reset: '最初から',
    currentLocation: '現地', unvisited: '未訪問', visited: '訪問済み', inspected: '調査済み',
    investigation: '調査', progress: '進行状況', locationProgress: '場所の調査', itemProgress: 'アイテムの調査',
    seedStatus: '銀色の種子', unknown: '未確認', carried: '所持中',
    progressStart: '村と周辺に残された痕跡を調査してください。',
    progressEnded: '調査は終了しました。',
    progressReady: 'すべての場所とアイテムの調査が完了しました。崖で最後の照合ができます。',
    progressContinue: '村と周辺の場所、入手したアイテムを調査してください。',
    pocket: '所持品', items: 'ITEMS', noItems: '所持品はありません。',
    fieldNote: '現地記録', lastEntry: '最新の記録', noEntry: 'まだ記録はありません。',
    saveFile: 'SAVE FILE', saveNote: '進行状況はブラウザに自動保存されません。JSONファイルに保存し、次回プレイ時に読み込んでください。',
    saveNotYet: '記録はまだファイルに保存されていません。',
    saveRequested: 'JSONファイルの保存を開始しました。ダウンロードフォルダーを確認してください。',
    saveSuccess: 'JSON記録ファイルを保存しました。', saveFailure: 'JSONの保存に失敗しました。ブラウザのダウンロード設定を確認してください。',
    loadSuccess: 'JSON記録を読み込みました。', loadFailure: '記録ファイルを読み込めませんでした。',
    confirmImport: '現在の調査記録を、読み込んだJSONファイルの内容に置き換えますか？',
    confirmReset: '現在の調査記録と所持品をすべて消去して、最初から始めますか？',
    resetReady: '新しい調査記録を開始しました。JSONファイルに保存してください。', resetSuccess: '新しい調査記録を開始しました。',
    mapPanel: 'SITE MAP / 調査区域', mapHeading: '調査区域',
    mapDescription: '調査区域の全体図です。現在地と道でつながっている場所へ移動できます。',
    currentRoute: '現在地から移動', currentPrefix: '現在地：', noMoves: '移動できる場所はありません。',
    inventoryPanel: 'INVENTORY / 所持品', inventoryHeading: '所持品',
    inventoryDescription: '入手した物を選んで個別に調査できます。調査前後で記録が変化することがあります。',
    noCollectedItems: 'まだ何も入手していません。', itemInspect: 'アイテムを調べる', itemDone: '調査済み', itemNotDone: '未調査',
    journalPanel: 'FIELD JOURNAL / 調査記録', journalHeading: '調査記録',
    journalDescription: '場所やアイテムで確認した内容が、時系列で記録されます。', noJournal: 'まだ記録はありません。',
    researchPanel: 'BIOLOGICAL NOTES / 生態調査', researchHeading: '生態調査記録',
    researchDescription: '調査した場所とアイテムの進行率に応じて、整理された研究記録が開示されます。記録本文は調査の進行に合わせて追加されます。',
    researchLocationRate: '場所の調査率', researchItemRate: 'アイテムの調査率',
    researchLocked: '未解禁', researchUnlocked: '閲覧可能', researchPending: 'この記録の本文はまだ記入されていません。', researchLockedHint: '調査条件を満たすと、この記録が開示される。',
    researchCondition: '開示条件', researchNeedLocations: '場所の調査', researchNeedItems: 'アイテムの調査',
    labelAfter: '調査後の所見', labelObservation: '観察記録', labelEvidence: '発見した記録',
    labelCompare: '照合可能', labelUnknown: '未確認',
    seedCompareReady: '所持している銀色の種子と、この遺骸の関係を確認できそうだ。',
    seedCompareLocked: 'この遺骸と銀色の種子の関係は、まだ確認できない。',
    inspectDone: '調査済み', inspectHintDone: '現地記録に内容が追加されています。',
    inspectButton: '調査する', inspectHint: '周囲を調査できます。',
    inspectCliff: '遺骸を調査する', inspectCliffHint: '遺骸の形状を記録します。最後の照合には追加調査が必要です。',
    compareButton: '遺骸と種子を照合する', compareHint: '所持している銀色の種子と遺骸を照合できます。',
    inspectCliffLockedHint: '遺骸と種子の関係を確認するには、ほかの場所とアイテムを調査してください。',
    seedPickupHint: '周囲を調査すると、銀色の種子を自動的に入手します。',
    movement: '移動可能な場所', routes: 'ROUTES',
    researchStage: '生態記録',
    endingTitle: '記録終了', endingOne: '頭蓋骨と脊椎を中心に残された遺骸。その表面に刻まれた紋様は、あなたが所持していた銀色の種子の紋様と正確に一致する。',
    endingTwo: '種子の外皮が裂ける。内部から根のように細い組織が伸びてくる。',
    endingThree: 'それは鼻腔へ入り込み、軟部組織を侵食し始める。組織は内側へ、さらに奥へと伸びていく。',
    endingFour: '何かが成長し始める。', endingMark: 'THE END · LEY LINE OF ANGEL',
    toastLocation: '周囲を調査して記録しました。', toastWell: '井戸の中から誰かの骨を入手しました。',
    toastItem: 'の詳細を記録しました。', toastJournal: '調査内容を記録しました。',
    toastEnding: '現地記録が終了しました。', toastAlready: 'すでに調査した場所です。',
    toastNotReady: '遺骸と種子の関係は、まだ確認できません。',
    toastFileMissing: 'ファイルが選択されていません。',
    footer: '進行状況はJSONファイルに保存・読み込みできます。',
    recordNo: 'RECORD No. 001', eyebrow: 'ARCHAEOLOGICAL FIELD NOTES · UNKNOWN SETTLEMENT',
    sectionCurrent: 'CURRENT LOCATION / 現地', sectionInvestigation: 'INVESTIGATION', sectionPocket: 'POCKET', sectionField: 'FIELD NOTE',
    sectionResearch: 'RESEARCH PROGRESS', sectionSave: 'SAVE FILE',
    unknownSettlement: '未知の集落', emptyResearch: '条件を満たすと、生態調査記録がここに表示されます。'
  },
  ko: {
    subtitle: '폐허가 된 마을의 현장 조사 기록', menuLabel: '기록 메뉴',
    tabField: '현장', tabMap: '지도', tabInventory: '소지품', tabJournal: '기록장', tabResearch: '생태 기록',
    switchLanguage: '日本語',
    save: 'JSON 저장', load: 'JSON 불러오기', reset: '처음부터',
    currentLocation: '현재 장소', unvisited: '미방문', visited: '방문함', inspected: '조사 완료',
    investigation: '조사', progress: '진행도', locationProgress: '장소 조사', itemProgress: '아이템 조사',
    seedStatus: '은색 씨앗', unknown: '미확인', carried: '소지 중',
    progressStart: '마을과 주변에 남겨진 흔적을 조사하세요.',
    progressEnded: '조사가 종료되었어요.',
    progressReady: '모든 장소와 아이템 조사가 끝났어요. 절벽에서 마지막 대조를 할 수 있어요.',
    progressContinue: '마을과 주변 장소, 획득한 아이템을 차례로 조사하세요.',
    pocket: '소지품', items: 'ITEMS', noItems: '소지품이 없습니다.',
    fieldNote: '현장 기록', lastEntry: '최근 기록', noEntry: '아직 기록된 내용이 없습니다.',
    saveFile: 'SAVE FILE', saveNote: '진행 기록은 브라우저에 자동 보관되지 않아요. JSON 파일로 저장하고 다음 실행 때 불러오세요.',
    saveNotYet: '현재 기록은 파일로 저장되지 않았어요.',
    saveRequested: 'JSON 파일 저장을 시작했어요. 다운로드 폴더를 확인하세요.',
    saveSuccess: 'JSON 기록 파일을 저장했어요.', saveFailure: 'JSON 저장에 실패했어요. 브라우저 다운로드 설정을 확인하세요.',
    loadSuccess: 'JSON 기록을 불러왔어요.', loadFailure: '기록 파일을 불러오지 못했어요.',
    confirmImport: '현재 조사 기록을 불러온 JSON 파일의 내용으로 교체할까요?',
    confirmReset: '현재 조사 기록과 소지품을 모두 지우고 처음부터 시작할까요?',
    resetReady: '새 조사 기록을 시작했어요. JSON 파일로 저장해 주세요.', resetSuccess: '새 조사 기록을 시작했어요.',
    mapPanel: 'SITE MAP / 조사 구역', mapHeading: '조사 구역',
    mapDescription: '전체 조사 구역을 확인할 수 있어요. 현재 위치와 연결된 장소로 이동할 수 있어요.',
    currentRoute: '현재 위치에서 이동', currentPrefix: '현재 위치: ', noMoves: '이동할 수 있는 장소가 없어요.',
    inventoryPanel: 'INVENTORY / 소지품', inventoryHeading: '소지품',
    inventoryDescription: '획득한 물건을 선택해 개별적으로 조사할 수 있어요. 조사 전후의 기록이 달라질 수 있어요.',
    noCollectedItems: '아직 획득한 물건이 없어요.', itemInspect: '아이템을 조사한다', itemDone: '조사 완료', itemNotDone: '미조사',
    journalPanel: 'FIELD JOURNAL / 조사 기록', journalHeading: '조사 기록',
    journalDescription: '장소와 소지품에서 확인한 내용이 시간순으로 기록돼요.', noJournal: '아직 기록된 내용이 없어요.',
    researchPanel: 'BIOLOGICAL NOTES / 생태 조사', researchHeading: '생태 조사 기록',
    researchDescription: '조사한 장소와 아이템의 진행률에 따라 정리된 연구 기록이 열려요. 기록 본문은 조사 진행에 맞춰 추가할 수 있어요.',
    researchLocationRate: '장소 조사율', researchItemRate: '아이템 조사율',
    researchLocked: '잠김', researchUnlocked: '열람 가능', researchPending: '이 기록의 본문은 아직 작성되지 않았어요.', researchLockedHint: '조사 조건을 충족하면 이 기록이 공개돼요.',
    researchCondition: '해금 조건', researchNeedLocations: '장소 조사', researchNeedItems: '아이템 조사',
    labelAfter: '조사 후 관찰', labelObservation: '관찰 기록', labelEvidence: '발견 기록',
    labelCompare: '대조 가능', labelUnknown: '미확인',
    seedCompareReady: '가지고 있는 은색 씨앗과 이 유해의 관계를 확인할 수 있을 것 같아요.',
    seedCompareLocked: '아직 이 유해와 은색 씨앗의 관계를 확인할 수 없어요.',
    inspectDone: '조사 완료', inspectHintDone: '현장 기록에 내용이 추가되어 있어요.',
    inspectButton: '조사한다', inspectHint: '주변을 조사할 수 있어요.',
    inspectCliff: '유해를 조사한다', inspectCliffHint: '유해의 형태를 기록해요. 마지막 대조에는 추가 조사가 필요해요.',
    compareButton: '유해와 씨앗을 대조한다', compareHint: '가지고 있는 은색 씨앗과 유해를 대조할 수 있어요.',
    inspectCliffLockedHint: '유해와 씨앗의 관계를 확인하려면 다른 장소와 아이템을 더 조사해야 해요.',
    seedPickupHint: '주변을 조사하면 은색 씨앗을 자동으로 획득해요.',
    movement: '이동 가능한 장소', routes: 'ROUTES',
    researchStage: '생태 기록',
    endingTitle: '기록 종료', endingOne: '두개골과 척추뼈를 중심으로 남아 있는 형체. 그 표면에 새겨진 문양은 당신이 가지고 있던 은색 씨앗의 문양과 정확히 일치해요.',
    endingTwo: '씨앗의 외피가 갈라져요. 안쪽에서 뿌리처럼 가느다란 조직이 뻗어 나와요.',
    endingThree: '그것은 비강 안으로 파고들어 연부 조직을 침식하기 시작해요. 조직은 안쪽으로, 더 안쪽으로 뻗어 가요.',
    endingFour: '무언가가 자라기 시작해요.', endingMark: 'THE END · LEY LINE OF ANGEL',
    toastLocation: '주변을 조사하고 기록했어요.', toastWell: '우물 안에서 누군가의 뼈를 획득했어요.',
    toastItem: '의 세부 사항을 기록했어요.', toastJournal: '조사 내용을 기록했어요.',
    toastEnding: '현장 기록이 종료되었어요.', toastAlready: '이미 조사한 장소예요.',
    toastNotReady: '유해와 씨앗의 관계를 아직 확인할 수 없어요.',
    toastFileMissing: '선택된 파일이 없어요.',
    footer: '진행 기록은 JSON 파일로 저장하고 불러올 수 있어요.',
    recordNo: 'RECORD No. 001', eyebrow: 'ARCHAEOLOGICAL FIELD NOTES · UNKNOWN SETTLEMENT',
    sectionCurrent: 'CURRENT LOCATION / 현장', sectionInvestigation: 'INVESTIGATION', sectionPocket: 'POCKET', sectionField: 'FIELD NOTE',
    sectionResearch: 'RESEARCH PROGRESS', sectionSave: 'SAVE FILE',
    unknownSettlement: '미지의 마을', emptyResearch: '조건을 충족하면 생태 조사 기록이 여기에 표시돼요.'
  }
};

const JA_LOCATIONS = {
  outskirts: { name: '村外れ', category: '村の外れ・開始地点', group: '村の外れ', description: 'ここには特に目立ったものはない。\n眼下には村が広がっている。', inspectText: '地面に小さな物体が落ちている。銀色を帯びた種子のようだ。', evidence: ['銀色の種子を入手した。'], inspectLabel: '周囲を調べる' },
  plaza: { name: '広場', category: '村の中心部', group: '村の中心部', description: '村人の人数が記録されている。\nその数は次第に減り、やがて記録そのものが途絶えている。', inspectText: '人口記録はある時点から減少し始めている。記録の間隔は一定せず、ある時を境に記録そのものが途切れている。', evidence: ['村の人口は徐々に減少し、やがて記録が完全に途絶えている。'] },
  school: { name: '学校', category: '教育施設と思われる建物', group: '村の中心部', description: '学校と思われる建物だ。\n子どもたちの落書きがあちこちに残っている。', inspectText: '落書きの中には、誰かが選ばれる様子を描いたものがある。人の身体から翼が生えてくる様子にも見える。', evidence: ['選ばれる人物と、翼が生える様子を描いた落書き。'] },
  tower: { name: '塔', category: '村で最も高い建造物', group: '村の中心部', description: '村で最も高い建物だ。石造りの構造物。', afterText: '誰かを閉じ込めていたようだ。村で最も高い塔。最上階には鐘が吊るされている。', inspectText: '牢獄のような場所が見える。食器は置かれていない。\n\n複雑な数式と思われる図式と、書類のようなものが置かれている。', evidence: ['書類の題名：「水源の移動について」', '書類の題名：「豊作について」', '書類の題名：「祭りの準備」'] },
  dwelling: { name: '民家', category: '居住区', group: '村の中心部', description: '人が暮らしていた痕跡の残る家だ。\n部屋の隅に紙の束が置かれている。', inspectText: '誰かの日記と思われる記録だ。\n\n「XXXXを連れて行くなんて、神もなんと無情なことを...\n何を間違えたのだろう...」', evidence: ['日記から、誰かが連れ去られた事件と、それによる喪失を読み取れる。'] },
  grandHouse: { name: '豪奢な邸宅', category: '比較的裕福だった家屋', group: '村の中心部', description: '顔料の跡や、朽ちた織物が比較的多く残されている場所だ。', inspectText: '古銭が山のように積まれた中に、何かが書き残されている。', evidence: ['「今年の天使はまだ現れていない。」', '「種を蒔かなければならない。」', '「ほかの場所に奪われるわけにはいかない...」', '何を奪われたくないのだろう。分からない。'] },
  temple: { name: '神殿', category: '宗教施設', group: '村の中心部', description: '六枚の翼を持つ生物の絵が、石壁のあちこちに並んでいる。\n人間の顔のような中央部は、それぞれ異なる姿をしている。', inspectText: '生物の下には、次のような文字が刻まれている。', evidence: ['「○○○の長子であった者、昇天す」', '「△△△の末子であった者、昇天す」', '誰かが昇天したという記録が延々と続いている。どこかに空白があるようだ。'] },
  templeUnderground: { name: '神殿地下', category: '神殿の地下空間', group: '村の中心部', description: '神殿の下へと続く地下空間だ。\n奇妙な形をした遺骨が、広い空間に大量に並べられている。', inspectText: '頭蓋骨と脊椎だけが残された遺骨が大量に置かれている。手足や胴体にあたる骨は見当たらない。', evidence: ['頭蓋骨と脊椎だけが残された、多数の遺骨を確認した。'] },
  orchard: { name: '果樹園', category: '村外れの農地', group: '農地と井戸', description: '果樹園と思われる土地だ。石造りの柵があり、\n豊作を祈る祭祀が行われたのか、祭具があちこちに散らばっている。', inspectText: '奇妙な紋様が、朽ちた旗のあちこちに残されている...', conditionalText: '銀色の種子に刻まれたものとまったく同じ紋様が、朽ちた旗のあちこちに残されている。何か関係があるのだろうか...?', evidence: ['朽ちた旗のあちこちに、奇妙な紋様が残されている。'] },
  well: { name: '井戸端', category: '村外れの井戸', group: '農地と井戸', description: '干上がった井戸がある。\n周囲には雑草が生い茂っている。', inspectText: '井戸の中には骨が詰まっている。どれも頭蓋骨と脊椎が抜き取られている。\nこれはすべて... 腕や脚の骨だろうか？', evidence: ['誰かの骨を入手した。'] },
  graveyard: { name: '墓地', category: '村から離れた静かな場所', group: '人里離れた場所', description: '一部の墓が掘り返されたのか、墓所のあちこちが空になっているようだ。\n掘り返された墓の墓碑には、どれも刻印と思われるものが刻まれている。', inspectText: '彼らには、遺骨に触れると祟られるという考えがなかったのだろうか。それとも、あったのだろうか？\n遺骨からは頭蓋骨と脊椎、腕や脚の骨が失われている。', evidence: ['掘り返された墓と、墓碑に刻まれた刻印を確認した。', '墓の遺骨から頭蓋骨、脊椎、腕や脚の骨が失われている。'] },
  ashSite: { name: '灰の積もる場所', category: '墓地の近く', group: '人里離れた場所', description: '墓地の近くに灰が積もった場所がある。\n古代の人々は、なぜここで何かを焼いたのだろう...\n一種の火葬場だったのかもしれない。', inspectText: '主に骨が焼かれたようで、白い灰が積もっている。', conditionalText: '積み重なった骨と、ここに転がっている骨に刻まれた印が一致している...', evidence: ['骨が焼かれたと思われる白い灰が積もっている。'] },
  forest: { name: '森', category: '村外れの森', group: '森と崖', description: '石に刻まれた立入禁止の印が目につく。', inspectText: '森へ入る道の入口に、古い立入禁止の印が刻まれている。森の奥へ続く道は、今も残っている。', evidence: ['森への立ち入りを禁じる古い印。'] },
  cliff: { name: '森の崖', category: '森の奥にある崖', group: '森と崖', description: '頭蓋骨と脊椎だけが残された、人間の遺骸と思われるものが置かれている。', inspectText: '頭蓋骨と脊椎を中心とした形状だ。骨の周囲には翼のような構造と、何本にも枝分かれした細い痕跡が残っている。\n\n一般的な人間の遺骨とは考えにくい。', evidence: ['人間の遺骨に似ているが、通常の解剖学的構造とは異なる形状。'] }
};

const JA_ITEMS = {
  seed: { name: '銀色の種子', before: '親指の第一関節ほどの大きさの種子。\n古いもののようだが、装飾品だろうか...？', after: '銀色の紋様が刻まれている。' },
  bone: { name: '誰かの骨', before: '細長い骨だ。', after: '脚の骨と思われる。\n骨には小さく「穢れた墓」にあった刻印が刻まれている。' }
};

const JA_GROUPS = {
  '마을 중심부': '村の中心部',
  '경작지와 우물': '農地と井戸',
  '외진 장소': '人里離れた場所',
  '숲과 절벽': '森と崖',
  '마을 바깥': '村の外れ'
};

export function t(key, language = DEFAULT_LANGUAGE) {
  return UI[language]?.[key] ?? UI[DEFAULT_LANGUAGE][key] ?? key;
}

export function locationText(id, field, language = DEFAULT_LANGUAGE) {
  if (language === 'ko') return LOCATIONS[id]?.[field] ?? '';
  return JA_LOCATIONS[id]?.[field] ?? LOCATIONS[id]?.[field] ?? '';
}

export function itemText(id, field, language = DEFAULT_LANGUAGE) {
  if (language === 'ko') return ITEMS[id]?.[field] ?? '';
  return JA_ITEMS[id]?.[field] ?? ITEMS[id]?.[field] ?? '';
}

export function groupText(name, language = DEFAULT_LANGUAGE) {
  if (language === 'ko') return name;
  return JA_GROUPS[name] ?? name;
}

export function bilingual(ko, ja) {
  return { ko, ja };
}

export function resolveText(value, language = DEFAULT_LANGUAGE) {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    return value[language] ?? value.ko ?? value.ja ?? '';
  }
  return '';
}

export function setStaticLanguage(language) {
  document.documentElement.lang = language === 'ko' ? 'ko' : 'ja';
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = t(element.dataset.i18n, language);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(element => {
    element.setAttribute('aria-label', t(element.dataset.i18nAria, language));
  });
  const title = document.getElementById('siteTitle');
  if (title) {
    title.innerHTML = language === 'ko'
      ? '천사맥 <span>天使脈</span>'
      : '天使脈 <span>천사맥</span>';
  }
  const switcher = document.getElementById('languageBtn');
  if (switcher) switcher.textContent = t('switchLanguage', language);
}
