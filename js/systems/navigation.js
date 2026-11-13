import { LOCATIONS, PHASE2_LOCATIONS } from '../data/locations.js';
import { isSecondPhaseUnlocked } from './research.js';

export function travel(state, destinationId) {
  if (!LOCATIONS[destinationId]) return false;

  // 100% 달성 뒤에는 기존 장소로 돌아갈 수 없고 ???만 선택할 수 있어요.
  if (state.endingUnlocked) {
    if (destinationId !== 'unknown' || state.endingEntered || state.ended) return false;
    state.current = 'unknown';
    state.endingEntered = true;
    if (!state.visited.includes('unknown')) state.visited.push('unknown');
    state.view = 'field';
    return true;
  }

  const currentLocation = LOCATIONS[state.current];
  if (state.ended || state.current === 'unknown' || !currentLocation) return false;
  if (!currentLocation.connections.includes(destinationId) || destinationId === 'unknown') return false;

  state.current = destinationId;
  if (!state.visited.includes(destinationId)) state.visited.push(destinationId);
  if (isSecondPhaseUnlocked(state)
      && PHASE2_LOCATIONS.includes(destinationId)
      && state.inspected.includes(destinationId)
      && !state.phase2Visited.includes(destinationId)) {
    state.phase2Visited.push(destinationId);
  }
  state.view = 'field';
  return true;
}
