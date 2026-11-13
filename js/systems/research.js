import { REQUIRED_LOCATIONS, PHASE2_LOCATIONS } from '../data/locations.js';
import { ITEMS } from '../data/items.js';
import { RESEARCH_RECORDS } from '../data/researchRecords.js';
import { locationProgress, itemProgress } from '../core/gameState.js';

const INITIAL_REPORT_IDS = ['ecology_01', 'ecology_02'];

export function isSecondPhaseUnlocked(state) {
  return INITIAL_REPORT_IDS.every(id => state.researchRead?.includes(id));
}

export function phase2LocationProgress(state) {
  return PHASE2_LOCATIONS.filter(id => state.inspectedPhase2?.includes(id)).length;
}

export function getResearchProgress(state) {
  const locations = locationProgress(state, REQUIRED_LOCATIONS);
  const phase2Locations = phase2LocationProgress(state);
  const items = itemProgress(state);
  const locationTotal = REQUIRED_LOCATIONS.length;
  const phase2Total = PHASE2_LOCATIONS.length;
  const itemTotal = Object.keys(ITEMS).length;
  const firstPhaseCompleted = locations + items;
  const firstPhaseTotal = locationTotal + itemTotal;
  const firstPhasePercent = Math.floor((firstPhaseCompleted / firstPhaseTotal) * 100);
  const completed = locations + phase2Locations + items;
  const total = locationTotal + phase2Total + itemTotal;
  return {
    locations,
    locationTotal,
    phase2Locations,
    phase2Total,
    items,
    itemTotal,
    firstPhaseCompleted,
    firstPhaseTotal,
    firstPhasePercent,
    completed,
    total,
    percent: Math.floor((completed / total) * 100)
  };
}

export function isResearchUnlocked(state, record) {
  if (record.afterEnding) return Boolean(state.ended);
  const progress = getResearchProgress(state);
  const percent = record.progressBasis === 'firstPhase'
    ? progress.firstPhasePercent
    : progress.percent;
  const threshold = Number(state.researchThresholds?.[record.id]);
  return Number.isFinite(threshold) && percent >= threshold;
}

export function getResearchThreshold(state, record) {
  if (record.afterEnding) return null;
  const threshold = Number(state.researchThresholds?.[record.id]);
  return Number.isFinite(threshold) ? threshold : record.unlockRange?.[1] ?? 100;
}

export function markResearchRead(state, recordId) {
  const record = RESEARCH_RECORDS.find(item => item.id === recordId);
  if (!record || !record.requiresRead || !isResearchUnlocked(state, record)) return false;
  if (!state.researchRead.includes(recordId)) state.researchRead.push(recordId);
  return true;
}

export function allResearchRecordsUnlocked(state) {
  return RESEARCH_RECORDS.every(record => isResearchUnlocked(state, record));
}
