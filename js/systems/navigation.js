import { LOCATIONS } from '../data/locations.js';

export function travel(state, destinationId) {
  const currentLocation = LOCATIONS[state.current];
  if (state.ended || !LOCATIONS[destinationId] || !currentLocation) return false;
  if (!currentLocation.connections.includes(destinationId)) return false;

  state.current = destinationId;
  if (!state.visited.includes(destinationId)) state.visited.push(destinationId);
  state.view = 'field';
  return true;
}
