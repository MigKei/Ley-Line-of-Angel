import { t, itemText } from '../core/i18n.js';

// inspectLocation()이 돌려주는 결과 메시지 → 토스트 문구 키.
// 새 결과 메시지를 추가하면 여기에도 등록해야 화면에 안내가 떠요.
export const LOCATION_RESULT_TOASTS = {
  endingReady: 'toastEndingReady',
  endingInspected: 'toastJournal',
  well: 'toastWell',
  location: 'toastLocation',
  journal: 'toastJournal',
  phase2: 'toastPhase2Inspected',
  already: 'toastAlready',
  phase2NeedRevisit: 'toastPhase2NeedRevisit',
  phase2NotUnlocked: 'toastPhase2NotUnlocked'
};

export function locationToast(message, language) {
  const key = LOCATION_RESULT_TOASTS[message];
  return key ? t(key, language) : '';
}

// inspectItem()의 결과 메시지는 'endingReady'이거나 조사한 아이템 ID예요.
export function itemToast(message, language) {
  if (!message) return '';
  if (message === 'endingReady') return t('toastEndingReady', language);
  return `${itemText(message, 'name', language)}${t('toastItem', language)}`;
}
