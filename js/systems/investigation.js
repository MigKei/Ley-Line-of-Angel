import { LOCATIONS } from '../data/locations.js';
import { ITEMS } from '../data/items.js';
import { addJournal } from '../core/journal.js';
import { hasItem, isLocationInspected, isItemInspected } from '../core/gameState.js';
import { canTriggerEnding } from './ending.js';
import { bilingual, itemText, locationText } from '../core/i18n.js';

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

export function inspectLocation(state, locationId) {
  const place = LOCATIONS[locationId];
  if (state.ended || !place || state.current !== locationId) {
    return { changed: false, message: '' };
  }

  if (locationId === 'cliff' && canTriggerEnding(state)) {
    state.ended = true;
    if (!isLocationInspected(state, 'cliff')) state.inspected.push('cliff');
    addJournal(state,
      bilingual('기록 종료', '記録終了'),
      bilingual(
        '유해에서 확인한 문양은 소지하고 있던 은색 씨앗의 문양과 일치한다. 씨앗의 외피가 갈라지고, 내부에서 뻗어 나온 조직이 비강 안쪽으로 파고들었다. 침식은 연부 조직을 지나 두개골 안쪽으로 이어진다.',
        '遺骸に刻まれた紋様は、所持していた銀色の種子の紋様と一致する。種子の外皮が裂け、内部から伸びた組織が鼻腔の奥へ入り込んだ。侵食は軟部組織を通り、頭蓋の内側へと続いていく。'
      ));
    return { changed: true, message: 'ending' };
  }

  if (isLocationInspected(state, locationId)) {
    if (locationId === 'cliff' && !canTriggerEnding(state)) {
      return { changed: false, message: 'notReady' };
    }
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
    return { changed: true, message: 'location' };
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
    return { changed: true, message: 'well' };
  }

  const bodyKo = [place.inspectText || '', ...(place.evidence || [])].filter(Boolean).join('\n');
  const bodyJa = [locationText(locationId, 'inspectText', 'ja'), ...(locationText(locationId, 'evidence', 'ja') || [])].filter(Boolean).join('\n');
  addJournal(state,
    bilingual(place.name, locationText(locationId, 'name', 'ja')),
    bilingual(bodyKo, bodyJa));
  recordConditionalFindings(state);
  return { changed: true, message: 'journal' };
}

export function inspectItem(state, itemId) {
  if (state.ended || !hasItem(state, itemId) || isItemInspected(state, itemId)) {
    return { changed: false, message: '' };
  }

  const item = ITEMS[itemId];
  if (!item) return { changed: false, message: '' };

  state.itemInspected.push(itemId);
  addJournal(state,
    bilingual(item.name + ' · 개별 조사', itemText(itemId, 'name', 'ja') + '・個別調査'),
    bilingual(item.after, itemText(itemId, 'after', 'ja')));
  recordConditionalFindings(state);
  return { changed: true, message: itemId };
}
