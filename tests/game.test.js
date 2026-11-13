import test from 'node:test';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { LOCATIONS, REQUIRED_LOCATIONS, PHASE2_LOCATIONS } from '../js/data/locations.js';
import { ITEMS } from '../js/data/items.js';
import { RESEARCH_RECORDS } from '../js/data/researchRecords.js';
import { ENDING_SCENE } from '../js/data/endingScene.js';
import { locationText, phase2Text, itemText, t } from '../js/core/i18n.js';
import { createInitialState } from '../js/core/gameState.js';
import { addJournal, formatJournalDate } from '../js/core/journal.js';
import { LOCATION_RESULT_TOASTS, locationToast, itemToast } from '../js/ui/toasts.js';
import { travel } from '../js/systems/navigation.js';
import { inspectItem, inspectLocation } from '../js/systems/investigation.js';
import { canTriggerEnding, chooseEnding } from '../js/systems/ending.js';
import { isResearchUnlocked, getResearchProgress, markResearchRead, isSecondPhaseUnlocked } from '../js/systems/research.js';
import { buildSavePayload, normalizeImportedState, SAVE_VERSION } from '../js/systems/saveManager.js';

function findPath(start, goal) {
  const queue = [[start]];
  const visited = new Set([start]);
  while (queue.length) {
    const path = queue.shift();
    const current = path[path.length - 1];
    if (current === goal) return path;
    for (const next of LOCATIONS[current].connections) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([...path, next]);
      }
    }
  }
  return null;
}

function goTo(state, destination) {
  const path = findPath(state.current, destination);
  assert.ok(path, `경로가 존재해야 해요: ${state.current} → ${destination}`);
  for (const step of path.slice(1)) assert.equal(travel(state, step), true);
}

function unlockPhase2(state) {
  // 임계값을 테스트용으로 낮춰 실제 보고서 열람 동작을 거쳐 2차 조사를 해금해요.
  state.researchThresholds.ecology_01 = 1;
  state.researchThresholds.ecology_02 = 1;
  assert.equal(isResearchUnlocked(state, RESEARCH_RECORDS[0]), true);
  assert.equal(markResearchRead(state, 'ecology_01'), true);
  assert.equal(markResearchRead(state, 'ecology_02'), true);
  assert.equal(isSecondPhaseUnlocked(state), true);
}

function completeAllSurveys(state) {
  inspectLocation(state, 'outskirts');
  inspectItem(state, 'seed');
  unlockPhase2(state);

  for (const id of REQUIRED_LOCATIONS) {
    goTo(state, id);
    if (!state.inspected.includes(id)) inspectLocation(state, id);
    if (id === 'well') inspectItem(state, 'bone');
  }
  if (!state.itemInspected.includes('bone')) inspectItem(state, 'bone');

  for (const id of PHASE2_LOCATIONS) {
    if (state.current === id) {
      const exit = LOCATIONS[id].connections[0];
      assert.equal(travel(state, exit), true);
    }
    goTo(state, id);
    assert.ok(state.phase2Visited.includes(id), `${id}는 실제 재방문으로 등록되어야 해요`);
    assert.equal(inspectLocation(state, id).changed, true);
  }
}

test('1차 장소 14곳과 2차 장소 5곳이 구분되고 전체가 연결되어 있어요', () => {
  assert.equal(Object.keys(LOCATIONS).length, 15); // 조사 장소 14곳 + ???
  assert.equal(REQUIRED_LOCATIONS.length, 14);
  assert.deepEqual(PHASE2_LOCATIONS, ['orchard', 'templeUnderground', 'graveyard', 'ashSite', 'well']);
  for (const id of REQUIRED_LOCATIONS) assert.ok(findPath('outskirts', id), `${id}에 도달할 수 있어야 해요`);
});

test('장소 연결은 지정한 지도 구조와 일치해요', () => {
  assert.deepEqual(LOCATIONS.outskirts.connections, ['plaza', 'forest']);
  assert.deepEqual(LOCATIONS.plaza.connections, ['outskirts', 'school', 'tower', 'dwelling', 'grandHouse', 'temple', 'well']);
  assert.deepEqual(LOCATIONS.school.connections, ['plaza']);
  assert.deepEqual(LOCATIONS.tower.connections, ['plaza']);
  assert.deepEqual(LOCATIONS.dwelling.connections, ['plaza', 'well']);
  assert.deepEqual(LOCATIONS.grandHouse.connections, ['plaza']);
  assert.deepEqual(LOCATIONS.temple.connections, ['plaza', 'templeUnderground', 'graveyard', 'ashSite']);
  assert.deepEqual(LOCATIONS.templeUnderground.connections, ['temple']);
  assert.deepEqual(LOCATIONS.well.connections, ['plaza', 'dwelling', 'orchard']);
  assert.deepEqual(LOCATIONS.orchard.connections, ['well']);
  assert.deepEqual(LOCATIONS.graveyard.connections, ['temple', 'ashSite']);
  assert.deepEqual(LOCATIONS.ashSite.connections, ['graveyard', 'temple']);
  assert.deepEqual(LOCATIONS.forest.connections, ['outskirts', 'cliff']);
  assert.deepEqual(LOCATIONS.cliff.connections, ['forest']);
  assert.deepEqual(findPath('plaza', 'orchard'), ['plaza', 'well', 'orchard']);
  assert.deepEqual(findPath('plaza', 'graveyard'), ['plaza', 'temple', 'graveyard']);
  assert.deepEqual(findPath('plaza', 'ashSite'), ['plaza', 'temple', 'ashSite']);
});

test('2차 조사 보고서의 해금은 1차 조사율 기준이며 두 편을 읽어야 2차 단계가 열려요', () => {
  const state = createInitialState();
  assert.ok(state.researchThresholds.ecology_01 >= 28 && state.researchThresholds.ecology_01 <= 32);
  assert.ok(state.researchThresholds.ecology_02 >= 33 && state.researchThresholds.ecology_02 <= 37);
  assert.ok(state.researchThresholds.ecology_03 >= 86 && state.researchThresholds.ecology_03 <= 90);
  assert.ok(state.researchThresholds.ecology_04 >= 95 && state.researchThresholds.ecology_04 <= 98);
  state.researchThresholds.ecology_01 = 31;
  state.researchThresholds.ecology_02 = 37;
  for (const id of REQUIRED_LOCATIONS.slice(0, 5)) state.inspected.push(id);
  assert.equal(getResearchProgress(state).firstPhasePercent, 31);
  assert.equal(isResearchUnlocked(state, RESEARCH_RECORDS[0]), true);
  assert.equal(isResearchUnlocked(state, RESEARCH_RECORDS[1]), false);
  assert.equal(isSecondPhaseUnlocked(state), false);
  assert.equal(markResearchRead(state, 'ecology_01'), true);
  assert.equal(isSecondPhaseUnlocked(state), false);
  for (const id of REQUIRED_LOCATIONS.slice(5, 6)) state.inspected.push(id);
  assert.equal(getResearchProgress(state).firstPhasePercent, 37);
  assert.equal(isResearchUnlocked(state, RESEARCH_RECORDS[1]), true);
  assert.equal(markResearchRead(state, 'ecology_02'), true);
  assert.equal(isSecondPhaseUnlocked(state), true);
});

test('2차 조사 장소는 보고서 열람 이후 실제로 다시 방문해야 조사할 수 있어요', () => {
  const state = createInitialState();
  inspectLocation(state, 'outskirts');
  goTo(state, 'plaza');
  goTo(state, 'well');
  inspectLocation(state, 'well');
  unlockPhase2(state);
  assert.equal(state.phase2Visited.includes('well'), false);
  assert.equal(inspectLocation(state, 'well').message, 'phase2NeedRevisit');
  goTo(state, 'plaza');
  goTo(state, 'well');
  assert.equal(state.phase2Visited.includes('well'), true);
  assert.equal(inspectLocation(state, 'well').changed, true);
  assert.equal(state.inspectedPhase2.includes('well'), true);
});

test('씨앗과 뼈의 개별 조사가 과수원·재가 쌓인 곳의 조건부 기록을 열어요', () => {
  const state = createInitialState();
  inspectLocation(state, 'outskirts');
  inspectItem(state, 'seed');
  goTo(state, 'orchard');
  inspectLocation(state, 'orchard');
  assert.ok(state.conditionalLogged.includes('orchard-seed'));

  goTo(state, 'well');
  inspectLocation(state, 'well');
  assert.ok(state.inventory.includes('bone'));
  inspectItem(state, 'bone');
  goTo(state, 'ashSite');
  inspectLocation(state, 'ashSite');
  assert.ok(state.conditionalLogged.includes('ash-bone'));
});

test('다섯 보고서 본문이 모두 채워져 있고 다섯 번째는 엔딩 후 공개돼요', () => {
  assert.equal(RESEARCH_RECORDS.length, 5);
  assert.deepEqual(RESEARCH_RECORDS.map(record => record.id), [
    'ecology_01', 'ecology_02', 'ecology_03', 'ecology_04', 'ecology_05'
  ]);
  for (const record of RESEARCH_RECORDS) {
    assert.ok(record.body.ko.trim().length > 0, `${record.id} 한국어 본문이 있어야 해요`);
    assert.ok(record.body.ja.trim().length > 0, `${record.id} 일본어 본문이 있어야 해요`);
  }
  assert.ok(RESEARCH_RECORDS[2].body.ko.includes('실존하던 존재가 사라졌음에도'));
  assert.equal(RESEARCH_RECORDS[4].afterEnding, true);
  assert.ok(ENDING_SCENE.description.ko.includes('은색 씨앗이 요동치고 있다.'));
  assert.ok(ENDING_SCENE.remove.ko.includes('이젠 아무것도 남아있지 않다...'));
  assert.ok(ENDING_SCENE.accept.ko.includes('선택받았다는 것을...■■■■■■'));
});

test('2차 조사 장소별 텍스트가 정확히 보존되어 있어요', () => {
  assert.equal(phase2Text('orchard', 'beforeText', 'ko'), '이 깃발들에 빼곡하게 그려진 각종 문양들은\n이 땅에서 난 씨앗을 표현한 것일까?');
  assert.ok(phase2Text('templeUnderground', 'inspectText', 'ko').includes("'유독 크고 비대한'"));
  assert.ok(phase2Text('graveyard', 'inspectText', 'ko').includes("'인위적으로 긁어낸 흔적'"));
  assert.ok(phase2Text('ashSite', 'inspectText', 'ko').includes("'자연적인 일그러짐'"));
  assert.ok(phase2Text('well', 'inspectText', 'ko').includes('일반적인 아동의 팔과 다리뼈'));
});

test('100%에는 1차 장소 14곳, 2차 장소 5곳, 아이템 2종이 모두 필요해요', () => {
  const state = createInitialState();
  completeAllSurveys(state);
  assert.equal(canTriggerEnding(state), true);
  assert.equal(state.endingUnlocked, true);
  const progress = getResearchProgress(state);
  assert.equal(progress.completed, 21);
  assert.equal(progress.total, 21);
  assert.equal(progress.percent, 100);
  assert.equal(travel(state, 'plaza'), false);
  assert.equal(travel(state, 'unknown'), true);
  assert.equal(state.current, 'unknown');
  assert.equal(state.endingEntered, true);
  assert.equal(inspectLocation(state, 'unknown').message, 'endingInspected');
});

test('떼어낸다와 떼어내지 않는다 모두 엔딩 이후 침입 보고서를 해금해요', () => {
  for (const choice of ['remove', 'accept']) {
    const state = createInitialState();
    completeAllSurveys(state);
    assert.equal(travel(state, 'unknown'), true);
    assert.equal(inspectLocation(state, 'unknown').changed, true);
    assert.equal(chooseEnding(state, choice), true);
    assert.equal(state.ended, true);
    assert.equal(state.endingChoice, choice);
    assert.equal(isResearchUnlocked(state, RESEARCH_RECORDS[4]), true);
    assert.equal(travel(state, 'plaza'), false);
  }
});

test('JSON 저장은 1차·2차 조사와 보고서 열람 상태를 보존해요', () => {
  const state = createInitialState();
  inspectLocation(state, 'outskirts');
  inspectItem(state, 'seed');
  unlockPhase2(state);
  goTo(state, 'plaza');
  goTo(state, 'well');
  inspectLocation(state, 'well');
  goTo(state, 'plaza');
  goTo(state, 'well');
  inspectLocation(state, 'well');

  const restored = normalizeImportedState(buildSavePayload(state));
  assert.equal(restored.current, 'well');
  assert.deepEqual(restored.inventory, ['seed', 'bone']);
  assert.deepEqual(restored.researchThresholds, state.researchThresholds);
  assert.deepEqual(restored.inspectedPhase2, ['well']);
  assert.deepEqual(restored.researchRead, ['ecology_01', 'ecology_02']);
  assert.equal(restored.endingUnlocked, false);
  assert.equal(restored.language, 'ja');
  assert.equal(typeof restored.journal[0].title, 'object');
  assert.equal(typeof restored.journal[0].body, 'object');
  assert.equal(SAVE_VERSION, 6);

  const legacy = normalizeImportedState({
    format: 'cheonsamaek-save',
    version: 5,
    state: {
      current: 'well',
      visited: ['well'],
      inspected: ['well'],
      inventory: ['bone'],
      journal: [{ title: '이전 기록', body: '이전 저장 파일의 내용' }]
    }
  });
  assert.equal(legacy.current, 'well');
  assert.equal(legacy.journal[0].title, '이전 기록');
  assert.deepEqual(legacy.itemInspected, []);
  assert.deepEqual(legacy.inspectedPhase2, []);
  assert.deepEqual(legacy.researchRead, []);
  assert.ok(legacy.researchThresholds.ecology_01 >= 28 && legacy.researchThresholds.ecology_01 <= 32);
});

test('일본어와 한국어 UI·장소·아이템 문구가 준비되어 있어요', () => {
  assert.equal(locationText('outskirts', 'name', 'ja'), '村外れ');
  assert.equal(locationText('outskirts', 'name', 'ko'), '외곽');
  assert.equal(itemText('seed', 'name', 'ja'), '銀色の種子');
  assert.equal(t('tabResearch', 'ja'), '生態記録');
  assert.equal(t('tabResearch', 'ko'), '생태 기록');
  assert.equal(t('phase2Label', 'ko'), '2차 조사');
  assert.equal(t('phase2Label', 'ja'), '第2段階の調査');
  assert.equal(locationText('unknown', 'name', 'ja'), '???');
  assert.equal(t('endingChoiceRemove', 'ko'), '떼어낸다');
});

test('조사 결과 메시지는 모두 일본어·한국어 토스트 문구로 연결돼요', () => {
  for (const [message, key] of Object.entries(LOCATION_RESULT_TOASTS)) {
    for (const language of ['ja', 'ko']) {
      assert.notEqual(t(key, language), key, `${message} → ${key} (${language}) 문구가 없어요`);
      assert.equal(locationToast(message, language), t(key, language));
    }
  }
  assert.equal(locationToast('알 수 없는 메시지', 'ko'), '');
  assert.ok(itemToast('seed', 'ja').startsWith('銀色の種子'));
  assert.equal(itemToast('endingReady', 'ko'), t('toastEndingReady', 'ko'));
});

test('investigation.js가 돌려주는 모든 장소 조사 결과가 토스트에 등록돼 있어요', () => {
  const returned = new Set();
  const collect = state => { const r = inspectLocation(state, state.current); if (r.message) returned.add(r.message); };

  // 일반 조사 · 중복 조사
  let state = createInitialState();
  collect(state); collect(state);
  travel(state, 'plaza'); collect(state);
  travel(state, 'well'); collect(state);

  // 2차 조사 장소: 보고서 미열람 → 열람 후 미재방문 → 재방문 후 성공
  state = createInitialState();
  state.inspected.push(...REQUIRED_LOCATIONS.filter(id => id !== 'orchard'));
  state.current = 'well'; travel(state, 'orchard'); collect(state);   // 1차
  collect(state);                                                      // 이미 완료 + 보고서 미열람
  state.researchRead.push('ecology_01', 'ecology_02');
  collect(state);                                                      // 재방문 필요
  travel(state, 'well'); travel(state, 'orchard'); collect(state);     // 2차 성공

  for (const expected of ['location', 'well', 'already', 'journal', 'phase2', 'phase2NeedRevisit', 'phase2NotUnlocked']) {
    assert.ok(returned.has(expected), `테스트가 ${expected} 경로를 거치지 않았어요`);
  }
  for (const message of returned) {
    assert.ok(message in LOCATION_RESULT_TOASTS, `토스트가 등록되지 않은 결과: ${message}`);
  }
});

test('일본어 엔딩의 연속 독백 구간은 가타카나로만 이루어져 있어요', () => {
  const lines = ENDING_SCENE.accept.ja.split('\n');
  const monologue = lines.find(line => line.startsWith('ワタシハ'));
  assert.ok(monologue, '가타카나 독백 줄이 없어요');
  assert.match(monologue.replace(/\.+$/, ''), /^[\u30A0-\u30FF]+$/);
  assert.ok(!/\s/.test(monologue), '독백에 공백이 들어 있어요');
  assert.ok(!ENDING_SCENE.accept.ja.includes('私は知っていた'));
});

test('일지 날짜는 표시할 때 현재 언어로 변환되고 예전 저장 형식은 그대로 보여줘요', () => {
  const state = createInitialState();
  addJournal(state, 't', 'b');
  assert.match(state.journal[0].date, /^\d{4}-\d{2}-\d{2}T/);
  const iso = '2026-11-02T06:30:00.000Z';
  assert.notEqual(formatJournalDate(iso, 'ja'), formatJournalDate(iso, 'ko'));
  assert.equal(formatJournalDate('2026. 11. 02. 오후 3:30', 'ja'), '2026. 11. 02. 오후 3:30');
  assert.equal(formatJournalDate('', 'ko'), '');
  assert.equal(formatJournalDate(undefined, 'ko'), '');
});

test('index.html의 모든 data-i18n 키가 일본어·한국어로 준비되어 있어요', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const keys = [...new Set([...html.matchAll(/data-i18n(?:-aria)?="([^"]+)"/g)].map(match => match[1]))];
  assert.ok(keys.length > 20);
  for (const key of keys) {
    for (const language of ['ja', 'ko']) {
      assert.notEqual(t(key, language), key, `${key} (${language}) 문구가 없어요`);
    }
  }
});

test('시작 화면에 필요한 요소가 있고 main.js가 그 버튼을 처리해요', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const main = readFileSync(new URL('../js/main.js', import.meta.url), 'utf8');
  assert.ok(html.includes('<body class="intro-active">'));
  for (const id of ['introScreen', 'introStartBtn', 'introLoadBtn', 'introLanguageBtn', 'introTitle']) {
    assert.ok(html.includes(`id="${id}"`), `${id} 요소가 없어요`);
  }
  for (const id of ['introStartBtn', 'introLoadBtn', 'introLanguageBtn']) {
    assert.ok(main.includes(`'${id}'`), `${id} 클릭 처리가 없어요`);
  }
  assert.ok(t('introWarning', 'ko').includes('고어'));
  assert.ok(t('introWarning', 'ja').includes('ゴア'));
});

test('시작 화면 제작 표기에 기획·번역·코딩 담당이 일본어·한국어로 적혀 있어요', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(html.includes('class="intro-credits"'));
  assert.ok(html.includes('미그'));
  assert.ok(html.includes('GPT &amp; Claude'));
  assert.equal(t('creditPlanLabel', 'ko'), '텍스트 & 기획');
  assert.equal(t('creditTranslation', 'ko'), '기계 번역 및 AI 번역');
  assert.equal(t('creditCodingLabel', 'ko'), '코딩');
  assert.equal(t('creditTranslation', 'ja'), '機械翻訳およびAI翻訳');
});
