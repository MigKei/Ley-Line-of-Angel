import test from 'node:test';
import assert from 'node:assert/strict';
import { LOCATIONS, REQUIRED_LOCATIONS } from '../js/data/locations.js';
import { ITEMS } from '../js/data/items.js';
import { RESEARCH_RECORDS } from '../js/data/researchRecords.js';
import { locationText, itemText, t } from '../js/core/i18n.js';
import { createInitialState } from '../js/core/gameState.js';
import { travel } from '../js/systems/navigation.js';
import { inspectItem, inspectLocation } from '../js/systems/investigation.js';
import { canTriggerEnding } from '../js/systems/ending.js';
import { isResearchUnlocked } from '../js/systems/research.js';
import { buildSavePayload, normalizeImportedState } from '../js/systems/saveManager.js';

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

test('모든 장소가 외곽에서 이동 가능해요', () => {
  for (const id of Object.keys(LOCATIONS)) {
    assert.ok(findPath('outskirts', id), `${id}에 도달할 수 있어야 해요`);
  }
  assert.equal(Object.keys(LOCATIONS).length, 14);
  assert.equal(REQUIRED_LOCATIONS.length, 13);
});

test('외곽 조사로 은색 씨앗을 획득하고 개별 조사할 수 있어요', () => {
  const state = createInitialState();
  const result = inspectLocation(state, 'outskirts');
  assert.equal(result.changed, true);
  assert.deepEqual(state.inventory, ['seed']);
  assert.equal(inspectItem(state, 'seed').changed, true);
  assert.deepEqual(state.itemInspected, ['seed']);
});

test('씨앗과 뼈의 개별 조사가 조건부 장소 기록을 열어요', () => {
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

test('절벽을 먼저 조사해도 나중에 조건을 채우면 결말을 볼 수 있어요', () => {
  const state = createInitialState();
  inspectLocation(state, 'outskirts');
  inspectItem(state, 'seed');
  goTo(state, 'cliff');
  inspectLocation(state, 'cliff');
  assert.equal(state.ended, false);

  for (const id of REQUIRED_LOCATIONS) {
    goTo(state, id);
    if (!state.inspected.includes(id)) inspectLocation(state, id);
    if (id === 'well') inspectItem(state, 'bone');
  }
  assert.equal(canTriggerEnding(state), true);
  goTo(state, 'cliff');
  assert.equal(inspectLocation(state, 'cliff').changed, true);
  assert.equal(state.ended, true);
});

test('신규 JSON 저장 형식과 기존 저장 형식을 복원할 수 있어요', () => {
  const state = createInitialState();
  inspectLocation(state, 'outskirts');
  const restored = normalizeImportedState(buildSavePayload(state));
  assert.equal(restored.current, 'outskirts');
  assert.deepEqual(restored.inventory, ['seed']);
  assert.equal(restored.journal.length, state.journal.length);
  assert.equal(restored.language, 'ja');
  assert.equal(typeof restored.journal[0].title, 'object');
  assert.equal(typeof restored.journal[0].body, 'object');

  const legacy = normalizeImportedState({
    format: 'cheonsamaek-save',
    version: 1,
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
});


test('日本語と韓国語の場所・アイテム・UI文言が用意されている', () => {
  assert.equal(locationText('outskirts', 'name', 'ja'), '村外れ');
  assert.equal(locationText('outskirts', 'name', 'ko'), '외곽');
  assert.equal(itemText('seed', 'name', 'ja'), '銀色の種子');
  assert.equal(t('tabResearch', 'ja'), '生態記録');
  assert.equal(t('tabResearch', 'ko'), '생태 기록');
});

test('生態調査記録は場所とアイテムの調査数で段階的に開示される', () => {
  assert.equal(RESEARCH_RECORDS.length, 4);
  assert.deepEqual(RESEARCH_RECORDS.map(record => record.unlock), [
    { locations: 3, items: 0 },
    { locations: 6, items: 1 },
    { locations: 9, items: 1 },
    { locations: 13, items: 2 }
  ]);
  const state = createInitialState();
  assert.equal(isResearchUnlocked(state, RESEARCH_RECORDS[0]), false);
  for (const id of REQUIRED_LOCATIONS.slice(0, 3)) { state.inspected.push(id); }
  assert.equal(isResearchUnlocked(state, RESEARCH_RECORDS[0]), true);
  assert.equal(isResearchUnlocked(state, RESEARCH_RECORDS[1]), false);
  state.inventory.push('seed');
  state.itemInspected.push('seed');
  assert.equal(isResearchUnlocked(state, RESEARCH_RECORDS[1]), false);
  for (const id of REQUIRED_LOCATIONS.slice(3, 6)) state.inspected.push(id);
  assert.equal(isResearchUnlocked(state, RESEARCH_RECORDS[1]), true);
});
