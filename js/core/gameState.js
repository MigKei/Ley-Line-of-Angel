import { LOCATIONS } from '../data/locations.js';
import { ITEMS } from '../data/items.js';

function randomBetween(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function createResearchThresholds() {
  return {
    ecology_01: randomBetween(28, 32),
    ecology_02: randomBetween(33, 37),
    ecology_03: randomBetween(86, 90),
    ecology_04: randomBetween(95, 98)
  };
}

export function createInitialState() {
  return {
    current: 'outskirts',
    visited: ['outskirts'],
    inspected: [],
    inspectedPhase2: [],
    phase2Visited: [],
    researchRead: [],
    inventory: [],
    itemInspected: [],
    journal: [],
    conditionalLogged: [],
    researchThresholds: createResearchThresholds(),
    endingUnlocked: false,
    endingEntered: false,
    endingInspected: false,
    endingChoice: null,
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
    && Array.isArray(state.inspectedPhase2)
    && Array.isArray(state.phase2Visited)
    && Array.isArray(state.researchRead)
    && Array.isArray(state.inventory)
    && Array.isArray(state.itemInspected)
    && Array.isArray(state.journal));
}
