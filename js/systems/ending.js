import { ITEMS } from '../data/items.js';
import { REQUIRED_LOCATIONS, PHASE2_LOCATIONS } from '../data/locations.js';
import { locationProgress, hasItem, isItemInspected } from '../core/gameState.js';

export function canTriggerEnding(state) {
  const firstPhaseComplete = locationProgress(state, REQUIRED_LOCATIONS) === REQUIRED_LOCATIONS.length;
  const secondPhaseComplete = PHASE2_LOCATIONS.every(id => state.inspectedPhase2.includes(id));
  const allItemsInspected = Object.keys(ITEMS).every(id => hasItem(state, id) && isItemInspected(state, id));
  return firstPhaseComplete && secondPhaseComplete && allItemsInspected;
}

export function refreshEndingUnlock(state) {
  if (!state.endingUnlocked && canTriggerEnding(state)) {
    state.endingUnlocked = true;
    state.view = 'map';
    return true;
  }
  return false;
}

export function chooseEnding(state, choice) {
  if (!state.endingEntered || !state.endingInspected || state.ended) return false;
  if (choice !== 'remove' && choice !== 'accept') return false;
  state.endingChoice = choice;
  state.ended = true;
  state.view = 'field';
  return true;
}
