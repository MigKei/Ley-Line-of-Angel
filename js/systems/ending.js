import { ITEMS } from '../data/items.js';
import { REQUIRED_LOCATIONS } from '../data/locations.js';
import { locationProgress, hasItem, isItemInspected } from '../core/gameState.js';

export function canTriggerEnding(state) {
  return locationProgress(state, REQUIRED_LOCATIONS) === REQUIRED_LOCATIONS.length
    && hasItem(state, 'seed')
    && Object.keys(ITEMS).every(id => hasItem(state, id) && isItemInspected(state, id));
}
