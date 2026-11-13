import { LOCATIONS, PHASE2_LOCATIONS } from '../data/locations.js';
import { ITEMS } from '../data/items.js';
import { addJournal } from '../core/journal.js';
import { hasItem, isLocationInspected, isItemInspected } from '../core/gameState.js';
import { refreshEndingUnlock } from './ending.js';
import { bilingual, itemText, locationText, phase2Text } from '../core/i18n.js';
import { isSecondPhaseUnlocked } from './research.js';

function recordConditionalFindings(state) {
  if (isLocationInspected(state, 'orchard') && isItemInspected(state, 'seed')
      && !state.conditionalLogged.includes('orchard-seed')) {
    state.conditionalLogged.push('orchard-seed');
    addJournal(state,
      bilingual('과수원 · 문양 대조', '果樹園・紋様の照合'),
      bilingual(LOCATIONS.orchard.conditionalText, locationText('orchard', 'conditionalText', 'ja')));
  }

  if (isLocationInspected(state, 'ashSite') && isItemInspected(state, 'bone')
      && !state.conditionalLogged.includes('ash-bone')) {
    state.conditionalLogged.push('ash-bone');
    addJournal(state,
      bilingual('재가 쌓인 곳 · 낙인 대조', '灰の積もる場所・刻印の照合'),
      bilingual(LOCATIONS.ashSite.conditionalText, locationText('ashSite', 'conditionalText', 'ja')));
  }
}

function unlockMessage(state, fallbackMessage) {
  return refreshEndingUnlock(state) ? 'endingReady' : fallbackMessage;
}

export function inspectLocation(state, locationId) {
  const place = LOCATIONS[locationId];
  if (!place || state.ended || state.current !== locationId) {
    return { changed: false, message: '' };
  }

  if (locationId === 'unknown') {
    if (!state.endingUnlocked || !state.endingEntered || state.endingInspected) {
      return { changed: false, message: 'already' };
    }
    state.endingInspected = true;
    return { changed: true, message: 'endingInspected' };
  }

  if (state.endingUnlocked) return { changed: false, message: '' };

  // 2차 조사 장소는 1차 완료 후, 두 초기 보고서를 읽고 다시 방문해야 조사할 수 있어요.
  if (PHASE2_LOCATIONS.includes(locationId) && isLocationInspected(state, locationId)) {
    if (!isSecondPhaseUnlocked(state)) return { changed: false, message: 'phase2NotUnlocked' };
    if (!state.phase2Visited.includes(locationId)) return { changed: false, message: 'phase2NeedRevisit' };
    if (state.inspectedPhase2.includes(locationId)) return { changed: false, message: 'already' };
    state.inspectedPhase2.push(locationId);
    addJournal(state,
      bilingual(place.name + ' · 2차 조사', locationText(locationId, 'name', 'ja') + '・第2段階の調査'),
      bilingual(phase2Text(locationId, 'inspectText', 'ko'), phase2Text(locationId, 'inspectText', 'ja')));
    recordConditionalFindings(state);
    return { changed: true, message: unlockMessage(state, 'phase2') };
  }

  if (isLocationInspected(state, locationId)) {
    return { changed: false, message: 'already' };
  }

  state.inspected.push(locationId);

  if (locationId === 'outskirts') {
    if (!hasItem(state, 'seed')) {
      state.inventory.push('seed');
      addJournal(state,
        bilingual('은색 씨앗 획득', '銀色の種子を入手'),
        bilingual(ITEMS.seed.before, itemText('seed', 'before', 'ja')));
    }
    addJournal(state,
      bilingual(place.name, locationText(locationId, 'name', 'ja')),
      bilingual('외곽을 조사했다. ' + place.inspectText, '村外れを調査した。' + locationText(locationId, 'inspectText', 'ja')));
    recordConditionalFindings(state);
    return { changed: true, message: unlockMessage(state, 'location') };
  }

  if (locationId === 'well') {
    if (!hasItem(state, 'bone')) {
      state.inventory.push('bone');
      addJournal(state,
        bilingual('누군가의 뼈 획득', '誰かの骨を入手'),
        bilingual(ITEMS.bone.before, itemText('bone', 'before', 'ja')));
    }
    addJournal(state,
      bilingual(place.name, locationText(locationId, 'name', 'ja')),
      bilingual(place.inspectText + '\n\n누군가의 뼈를 획득했다.', locationText(locationId, 'inspectText', 'ja') + '\n\n誰かの骨を入手した。'));
    recordConditionalFindings(state);
    return { changed: true, message: unlockMessage(state, 'well') };
  }

  const bodyKo = [place.inspectText || '', ...(place.evidence || [])].filter(Boolean).join('\n');
  const bodyJa = [locationText(locationId, 'inspectText', 'ja'), ...(locationText(locationId, 'evidence', 'ja') || [])].filter(Boolean).join('\n');
  addJournal(state,
    bilingual(place.name, locationText(locationId, 'name', 'ja')),
    bilingual(bodyKo, bodyJa));
  recordConditionalFindings(state);
  return { changed: true, message: unlockMessage(state, 'journal') };
}

export function inspectItem(state, itemId) {
  if (state.ended || state.endingUnlocked || !hasItem(state, itemId) || isItemInspected(state, itemId)) {
    return { changed: false, message: '' };
  }

  const item = ITEMS[itemId];
  if (!item) return { changed: false, message: '' };

  state.itemInspected.push(itemId);
  addJournal(state,
    bilingual(item.name + ' · 개별 조사', itemText(itemId, 'name', 'ja') + '・個別調査'),
    bilingual(item.after, itemText(itemId, 'after', 'ja')));
  recordConditionalFindings(state);
  return { changed: true, message: unlockMessage(state, itemId) };
}
