import { LOCATIONS } from '../data/locations.js';
import { ITEMS } from '../data/items.js';

export function createInitialState() {
  return {
    current: 'outskirts',
    visited: ['outskirts'],
    inspected: [],
    inventory: [],
    itemInspected: [],
    journal: [],
    conditionalLogged: [],
    ended: false,
    view: 'field',
    language: 'ja'
  };
}

export const game = {
  state: createInitialState()
};

export function replaceState(nextState) {
  game.state = nextState;
}

export function resetState() {
  game.state = createInitialState();
  return game.state;
}

export function isLocationInspected(state, id) {
  return state.inspected.includes(id);
}

export function hasItem(state, id) {
  return state.inventory.includes(id);
}

export function isItemInspected(state, id) {
  return state.itemInspected.includes(id);
}

export function locationStatus(state, id) {
  if (isLocationInspected(state, id)) return '조사 완료';
  if (state.visited.includes(id)) return '방문함';
  return '미방문';
}

export function locationProgress(state, requiredLocations) {
  return requiredLocations.filter(id => isLocationInspected(state, id)).length;
}

export function itemProgress(state) {
  return Object.keys(ITEMS).filter(id => hasItem(state, id) && isItemInspected(state, id)).length;
}

export function isKnownState(state) {
  return Boolean(state && typeof state === 'object'
    && LOCATIONS[state.current]
    && Array.isArray(state.visited)
    && Array.isArray(state.inspected)
    && Array.isArray(state.inventory)
    && Array.isArray(state.itemInspected)
    && Array.isArray(state.journal));
}
