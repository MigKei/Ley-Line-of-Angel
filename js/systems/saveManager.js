import { LOCATIONS, REQUIRED_LOCATIONS, PHASE2_LOCATIONS } from '../data/locations.js';
import { ITEMS } from '../data/items.js';
import { createInitialState } from '../core/gameState.js';

export const SAVE_FORMAT = 'ley-line-of-angel-save';
export const SAVE_VERSION = 6;

export function buildSavePayload(state) {
  return {
    format: SAVE_FORMAT,
    version: SAVE_VERSION,
    game: 'Ley Line of Angel',
    savedAt: new Date().toISOString(),
    state: {
      current: state.current,
      visited: [...state.visited],
      inspected: [...state.inspected],
      inspectedPhase2: [...state.inspectedPhase2],
      phase2Visited: [...state.phase2Visited],
      researchRead: [...state.researchRead],
      inventory: [...state.inventory],
      itemInspected: [...state.itemInspected],
      journal: state.journal.map(entry => ({
        title: entry.title,
        body: entry.body,
        date: entry.date || ''
      })),
      conditionalLogged: [...state.conditionalLogged],
      researchThresholds: { ...state.researchThresholds },
      endingUnlocked: Boolean(state.endingUnlocked),
      endingEntered: Boolean(state.endingEntered),
      endingInspected: Boolean(state.endingInspected),
      endingChoice: state.endingChoice || null,
      ended: Boolean(state.ended),
      language: state.language === 'ko' ? 'ko' : 'ja'
    }
  };
}

export function downloadSave(state) {
  const json = JSON.stringify(buildSavePayload(state), null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  link.href = url;
  link.download = `ley-line-of-angel-save-${stamp}.json`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function normalizeList(value, validSet, label, language) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    throw new Error(language === 'ko' ? `${label} 데이터가 배열 형식이 아니에요.` : `${label}データは配列形式である必要があります。`);
  }
  return [...new Set(value.filter(id => typeof id === 'string' && validSet.has(id)))];
}

function normalizeLocalizedText(value, language, label, title = false) {
  if (typeof value === 'string') return value.slice(0, title ? 500 : 20000);
  if (value && typeof value === 'object' && !Array.isArray(value)
      && ['ko', 'ja'].some(key => typeof value[key] === 'string')) {
    return {
      ko: typeof value.ko === 'string' ? value.ko.slice(0, title ? 500 : 20000) : '',
      ja: typeof value.ja === 'string' ? value.ja.slice(0, title ? 500 : 20000) : ''
    };
  }
  throw new Error(language === 'ko' ? `${label}의 형식이 올바르지 않아요.` : `${label}の形式が正しくありません。`);
}

export function normalizeImportedState(payload) {
  const language = payload?.state?.language === 'ko' || payload?.language === 'ko' ? 'ko' : 'ja';
  const fail = (ko, ja) => { throw new Error(language === 'ko' ? ko : ja); };
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    fail('JSON 최상위 형식이 올바르지 않아요.', 'JSONファイルの形式が正しくありません。');
  }

  const allowedFormats = [SAVE_FORMAT, 'cheonsamaek-save'];
  if (payload.format && !allowedFormats.includes(payload.format)) {
    fail('Ley Line of Angel 기록 파일이 아니에요.', 'Ley Line of Angelのセーブファイルではありません。');
  }
  if (Number(payload.version || 1) > SAVE_VERSION) {
    fail('현재 게임보다 새로운 형식의 저장 파일이에요.', 'このゲームより新しい形式のセーブファイルです。');
  }

  const source = payload.state && typeof payload.state === 'object' && !Array.isArray(payload.state)
    ? payload.state
    : payload;
  const validLocations = new Set(Object.keys(LOCATIONS));
  const validItems = new Set(Object.keys(ITEMS));

  if (typeof source.current !== 'string' || !validLocations.has(source.current)) {
    fail('저장 파일의 현재 위치를 확인할 수 없어요.', 'セーブファイルの現在地を確認できません。');
  }

  const visited = normalizeList(source.visited, validLocations, '방문 장소', language);
  const inspected = normalizeList(source.inspected, new Set(REQUIRED_LOCATIONS), '1차 조사 장소', language);
  const inspectedPhase2 = normalizeList(source.inspectedPhase2, new Set(PHASE2_LOCATIONS), '2차 조사 장소', language);
  const phase2Visited = normalizeList(source.phase2Visited, new Set(PHASE2_LOCATIONS), '2차 조사 재방문 장소', language)
    .filter(id => inspected.includes(id) && visited.includes(id));
  const researchRead = normalizeList(source.researchRead, new Set(['ecology_01', 'ecology_02']), '읽은 연구 기록', language);
  const inventory = normalizeList(source.inventory, validItems, '소지품', language);
  const itemInspected = normalizeList(source.itemInspected, validItems, '아이템 조사', language)
    .filter(id => inventory.includes(id));

  const rawJournal = source.journal ?? [];
  if (!Array.isArray(rawJournal)) fail('조사 기록 목록의 형식이 올바르지 않아요.', '調査記録の一覧形式が正しくありません。');
  const journal = rawJournal.map((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      fail(`조사 기록 ${index + 1}번의 형식이 올바르지 않아요.`, `調査記録 ${index + 1} 件目の形式が正しくありません。`);
    }
    return {
      title: normalizeLocalizedText(entry.title, language, `조사 기록 ${index + 1} 제목`, true),
      body: normalizeLocalizedText(entry.body, language, `조사 기록 ${index + 1} 내용`),
      date: typeof entry.date === 'string' ? entry.date.slice(0, 100) : ''
    };
  });

  const conditionalLogged = normalizeList(
    source.conditionalLogged,
    new Set(['orchard-seed', 'ash-bone']),
    '조건부 기록',
    language
  );
  const defaults = createInitialState().researchThresholds;
  const researchThresholds = { ...defaults };
  if (source.researchThresholds && typeof source.researchThresholds === 'object') {
    for (const key of Object.keys(defaults)) {
      const value = Number(source.researchThresholds[key]);
      if (Number.isFinite(value) && value >= 1 && value <= 100) researchThresholds[key] = value;
    }
  }

  const allLocationsInspected = REQUIRED_LOCATIONS.every(id => inspected.includes(id));
  const allPhase2Inspected = PHASE2_LOCATIONS.every(id => inspectedPhase2.includes(id));
  const allItemsInspected = Object.keys(ITEMS).every(id => inventory.includes(id) && itemInspected.includes(id));
  const legacyEnded = Boolean(source.ended);
  // 구 버전의 미진행 엔딩 해금은 새 2차 조사 조건을 충족하기 전까지 보류해요.
  const endingUnlocked = legacyEnded || source.current === 'unknown'
    || (allLocationsInspected && allPhase2Inspected && allItemsInspected);
  let endingEntered = Boolean(source.endingEntered) || source.current === 'unknown' || legacyEnded;
  const endingInspected = Boolean(source.endingInspected) || legacyEnded;
  let endingChoice = source.endingChoice === 'remove' || source.endingChoice === 'accept'
    ? source.endingChoice
    : (legacyEnded ? 'accept' : null);
  let current = source.current;
  // 이전 버전의 절벽 직결 엔딩 저장은 새 결말 화면으로 옮겨 호환해요.
  if (legacyEnded && current !== 'unknown') current = 'unknown';
  if (current === 'unknown') endingEntered = true;
  if (!visited.includes(current)) visited.push(current);

  return {
    current,
    visited,
    inspected,
    inspectedPhase2,
    phase2Visited,
    researchRead,
    inventory,
    itemInspected,
    journal,
    conditionalLogged,
    researchThresholds,
    endingUnlocked,
    endingEntered,
    endingInspected,
    endingChoice,
    ended: legacyEnded || Boolean(endingChoice),
    view: endingUnlocked && !endingEntered ? 'map' : 'field',
    language
  };
}

export async function readSaveFile(file) {
  if (!file) throw new Error('ファイルが選択されていません。');
  let rawText;
  if (typeof file.text === 'function') {
    rawText = await file.text();
  } else {
    rawText = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('ファイルを読み込めません。'));
      reader.readAsText(file, 'UTF-8');
    });
  }

  let payload;
  try {
    payload = JSON.parse(rawText);
  } catch {
    throw new Error('JSONを解析できません。ファイルが破損していないか確認してください。');
  }
  return normalizeImportedState(payload);
}
