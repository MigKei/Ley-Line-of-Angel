import { REQUIRED_LOCATIONS } from '../data/locations.js';
import { ITEMS } from '../data/items.js';
import { locationProgress, itemProgress } from '../core/gameState.js';

export function getResearchProgress(state) {
  return {
    locations: locationProgress(state, REQUIRED_LOCATIONS),
    locationTotal: REQUIRED_LOCATIONS.length,
    items: itemProgress(state),
    itemTotal: Object.keys(ITEMS).length
  };
}

export function isResearchUnlocked(state, record) {
  const progress = getResearchProgress(state);
  return progress.locations >= record.unlock.locations
    && progress.items >= record.unlock.items;
}
