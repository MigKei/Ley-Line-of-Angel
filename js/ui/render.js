import { LOCATIONS, MAP_GROUPS, REQUIRED_LOCATIONS } from '../data/locations.js';
import { ITEMS } from '../data/items.js';
import { RESEARCH_RECORDS } from '../data/researchRecords.js';
import {
  isLocationInspected, hasItem, isItemInspected,
  locationProgress, itemProgress
} from '../core/gameState.js';
import { canTriggerEnding } from '../systems/ending.js';
import { getResearchProgress, isResearchUnlocked } from '../systems/research.js';
import { escapeHtml } from './dom.js';
import { t, locationText, itemText, groupText, resolveText, setStaticLanguage } from '../core/i18n.js';

export function setView(state, view) {
  state.view = view;
  document.querySelectorAll('.tab').forEach(button => {
    button.classList.toggle('active', button.dataset.view === view);
  });
  document.getElementById('fieldView').style.display = view === 'field' ? 'grid' : 'none';
  document.getElementById('mapView').style.display = view === 'map' ? 'block' : 'none';
  document.getElementById('inventoryView').style.display = view === 'inventory' ? 'block' : 'none';
  document.getElementById('journalView').style.display = view === 'journal' ? 'block' : 'none';
  document.getElementById('researchView').style.display = view === 'research' ? 'block' : 'none';
  renderAll(state);
}

function statusText(state, id) {
  if (isLocationInspected(state, id)) return t('inspected', state.language);
  if (state.visited.includes(id)) return t('visited', state.language);
  return t('unvisited', state.language);
}

function renderLocation(state) {
  const language = state.language;
  const id = state.current;
  const place = LOCATIONS[id];
  const inspected = isLocationInspected(state, id);
  document.getElementById('locationStatus').textContent = statusText(state, id);

  let body = `<div class="location-kicker">${escapeHtml(locationText(id, 'category', language))}</div>`;
  body += `<h2>${escapeHtml(locationText(id, 'name', language))}</h2><div class="location-en">${escapeHtml(place.en)}</div>`;
  body += '<div class="ornament">— · — · —</div>';
  body += `<div class="description">${escapeHtml(locationText(id, 'description', language))}</div>`;

  if (place.afterText && inspected) {
    body += `<div class="observation"><span class="label">${escapeHtml(t('labelAfter', language))}</span>${escapeHtml(locationText(id, 'afterText', language))}</div>`;
  }

  if (inspected && id !== 'cliff') {
    let observation = locationText(id, 'inspectText', language) || '';
    if (id === 'orchard' && isItemInspected(state, 'seed')) {
      observation = locationText(id, 'conditionalText', language) || observation;
    }
    if (id === 'ashSite' && isItemInspected(state, 'bone')) {
      observation += '\n\n' + locationText(id, 'conditionalText', language);
    }
    body += `<div class="observation"><span class="label">${escapeHtml(t('labelObservation', language))}</span>${escapeHtml(observation)}</div>`;
    const evidence = locationText(id, 'evidence', language) || [];
    if (evidence.length) {
      body += `<div class="evidence"><div class="evidence-title">${escapeHtml(t('labelEvidence', language))}</div><div class="evidence-list">${evidence.map(item => `<div class="evidence-item">${escapeHtml(item)}</div>`).join('')}</div></div>`;
    }
  }

  if (id === 'cliff' && inspected) {
    body += `<div class="observation"><span class="label">${escapeHtml(t('labelObservation', language))}</span>${escapeHtml(locationText(id, 'inspectText', language))}</div>`;
    if (canTriggerEnding(state)) {
      body += `<div class="evidence"><div class="evidence-title">${escapeHtml(t('labelCompare', language))}</div><div class="evidence-item">${escapeHtml(t('seedCompareReady', language))}</div></div>`;
    } else {
      body += `<div class="evidence"><div class="evidence-title">${escapeHtml(t('labelUnknown', language))}</div><div class="evidence-item">${escapeHtml(t('seedCompareLocked', language))}</div></div>`;
    }
  }

  if (state.ended) {
    body += `<div class="ending">
      <h3>${escapeHtml(t('endingTitle', language))}</h3>
      <p>${escapeHtml(t('endingOne', language))}</p>
      <p>${escapeHtml(t('endingTwo', language))}</p>
      <p>${escapeHtml(t('endingThree', language))}</p>
      <p>${escapeHtml(t('endingFour', language))}</p>
      <div class="ending-mark">${escapeHtml(t('endingMark', language))}</div>
    </div>`;
  } else {
    let label = inspected ? t('inspectDone', language) : (locationText(id, 'inspectLabel', language) || t('inspectButton', language));
    let disabled = inspected;
    let hint = inspected ? t('inspectHintDone', language) : t('inspectHint', language);

    if (id === 'cliff') {
      if (inspected && canTriggerEnding(state)) {
        label = t('compareButton', language);
        disabled = false;
        hint = t('compareHint', language);
      } else if (inspected) {
        label = t('inspectDone', language);
        disabled = true;
        hint = t('inspectCliffLockedHint', language);
      } else {
        label = t('inspectCliff', language);
        disabled = false;
        hint = t('inspectCliffHint', language);
      }
    }
    if (id === 'outskirts' && !hasItem(state, 'seed')) hint = t('seedPickupHint', language);
    body += `<div class="investigate-row"><button class="action" id="inspectBtn" ${disabled ? 'disabled' : ''}>${escapeHtml(label)}</button><span class="hint">${escapeHtml(hint)}</span></div>`;
  }

  const connections = place.connections.map(next => `<button class="move" data-go="${next}" ${state.ended ? 'disabled' : ''}>${escapeHtml(locationText(next, 'name', language))}</button>`).join('');
  body += `<div class="movement"><div class="movement-head"><span class="movement-title">${escapeHtml(t('movement', language))}</span><span class="smallcaps">${place.connections.length} ${escapeHtml(t('routes', language))}</span></div><div class="move-grid">${connections}</div></div>`;
  document.getElementById('locationContent').innerHTML = body;
}

function renderMap(state) {
  const language = state.language;
  const groupsElement = document.getElementById('mapGroups');
  groupsElement.innerHTML = MAP_GROUPS.map(group => {
    const nodes = group.ids.map(id => {
      const current = id === state.current;
      const status = statusText(state, id);
      const accessible = LOCATIONS[state.current].connections.includes(id);
      const disabled = (!accessible || state.ended) && !current;
      const currentSuffix = current ? (language === 'ja' ? ' · 現在地' : ' · 현재 위치') : '';
      const doneClass = isLocationInspected(state, id) ? 'done' : '';
      return `<button class="node ${current ? 'current' : ''}" data-node="${id}" ${disabled ? 'disabled' : ''}>
        <span class="node-name">${escapeHtml(locationText(id, 'name', language))}${escapeHtml(currentSuffix)}</span>
        <span class="node-meta"><span>${escapeHtml(locationText(id, 'category', language))}</span><span class="${doneClass}">${escapeHtml(status)}</span></span>
      </button>`;
    }).join('');
    return `<section class="map-group"><div class="map-group-title">${escapeHtml(groupText(group.name, language))}</div><div class="map-grid">${nodes}</div></section>`;
  }).join('');

  document.getElementById('mapCurrent').textContent = `${t('currentPrefix', language)}${locationText(state.current, 'name', language)}`;
  const moves = LOCATIONS[state.current].connections;
  document.getElementById('mapMoves').innerHTML = moves.length
    ? moves.map(id => `<button class="move" data-map-go="${id}" ${state.ended ? 'disabled' : ''}>${escapeHtml(locationText(id, 'name', language))}</button>`).join('')
    : `<span class="empty-move">${escapeHtml(t('noMoves', language))}</span>`;
}

function renderInventory(state) {
  const language = state.language;
  const list = document.getElementById('inventoryList');
  if (!state.inventory.length) {
    list.innerHTML = `<div class="empty-state">${escapeHtml(t('noCollectedItems', language))}</div>`;
    return;
  }

  list.innerHTML = state.inventory.map(id => {
    const item = ITEMS[id];
    const examined = isItemInspected(state, id);
    const description = itemText(id, examined ? 'after' : 'before', language);
    const status = examined ? t('itemDone', language) : t('itemNotDone', language);
    const button = examined
      ? `<button class="item-inspect done" disabled>${escapeHtml(t('itemDone', language))}</button>`
      : `<button class="item-inspect" data-item-inspect="${id}">${escapeHtml(t('itemInspect', language))}</button>`;
    return `<article class="record-card item-card">
      <div class="item-symbol">${escapeHtml(item.symbol)}</div>
      <div class="item-copy"><h3>${escapeHtml(itemText(id, 'name', language))}</h3><p>${escapeHtml(description)}</p>
      <div class="item-meta">${escapeHtml(status)}</div>${button}</div>
    </article>`;
  }).join('');
}

function renderJournal(state) {
  const language = state.language;
  const list = document.getElementById('journalList');
  if (!state.journal.length) {
    list.innerHTML = `<div class="empty-state">${escapeHtml(t('noJournal', language))}</div>`;
    return;
  }
  list.innerHTML = state.journal.map(entry => `<article class="record-card">
    <div class="meta">${escapeHtml(entry.date || 'FIELD RECORD')}</div>
    <h3>${escapeHtml(resolveText(entry.title, language))}</h3><p>${escapeHtml(resolveText(entry.body, language))}</p>
  </article>`).join('');
}

function renderResearch(state) {
  const language = state.language;
  const { locations: locationCount, locationTotal, items: itemCount, itemTotal } = getResearchProgress(state);
  const locationRate = Math.round(locationCount / locationTotal * 100);
  const itemRate = Math.round(itemCount / itemTotal * 100);
  document.getElementById('researchProgress').innerHTML = `
    <div class="research-meter">
      <div class="progress-meta"><span>${escapeHtml(t('researchLocationRate', language))}</span><span>${locationCount}/${locationTotal} · ${locationRate}%</span></div>
      <div class="progress-line"><div class="progress-fill" style="width:${locationRate}%"></div></div>
    </div>
    <div class="research-meter">
      <div class="progress-meta"><span>${escapeHtml(t('researchItemRate', language))}</span><span>${itemCount}/${itemTotal} · ${itemRate}%</span></div>
      <div class="progress-line"><div class="progress-fill" style="width:${itemRate}%"></div></div>
    </div>`;

  const cards = RESEARCH_RECORDS.map((record, index) => {
    const unlocked = isResearchUnlocked(state, record);
    const body = resolveText(record.body, language).trim();
    const status = unlocked ? t('researchUnlocked', language) : t('researchLocked', language);
    const condition = `${t('researchNeedLocations', language)} ${record.unlock.locations}/${REQUIRED_LOCATIONS.length} · ${t('researchNeedItems', language)} ${record.unlock.items}/${Object.keys(ITEMS).length}`;
    const content = unlocked ? (body || t('researchPending', language)) : t('researchLockedHint', language);
    return `<article class="research-card ${unlocked ? 'unlocked' : 'locked'}">
      <div class="research-card-head"><span class="research-index">${String(index + 1).padStart(2, '0')}</span><span class="research-status">${escapeHtml(status)}</span></div>
      <h3>${escapeHtml(resolveText(record.title, language))}</h3>
      <p>${escapeHtml(content)}</p>
      <div class="research-condition">${escapeHtml(t('researchCondition', language))} · ${escapeHtml(condition)}</div>
    </article>`;
  }).join('');
  document.getElementById('researchList').innerHTML = cards || `<div class="empty-state">${escapeHtml(t('emptyResearch', language))}</div>`;
}

function renderSide(state) {
  const language = state.language;
  const count = locationProgress(state, REQUIRED_LOCATIONS);
  const itemCount = itemProgress(state);
  document.getElementById('progressText').textContent = `${count} / ${REQUIRED_LOCATIONS.length}`;
  document.getElementById('progressFill').style.width = `${count / REQUIRED_LOCATIONS.length * 100}%`;
  document.getElementById('itemProgressText').textContent = `${itemCount} / ${Object.keys(ITEMS).length}`;
  document.getElementById('itemProgressFill').style.width = `${itemCount / Object.keys(ITEMS).length * 100}%`;
  document.getElementById('seedStatus').textContent = hasItem(state, 'seed')
    ? (isItemInspected(state, 'seed') ? t('inspected', language) : t('carried', language))
    : t('unknown', language);
  document.getElementById('progressNote').textContent = state.ended
    ? t('progressEnded', language)
    : canTriggerEnding(state)
      ? t('progressReady', language)
      : t('progressContinue', language);
  document.getElementById('quickInventory').innerHTML = state.inventory.length
    ? state.inventory.map(id => `<div class="quick-item"><span>${escapeHtml(itemText(id, 'name', language))}</span><span>${escapeHtml(isItemInspected(state, id) ? t('itemDone', language) : t('itemNotDone', language))}</span></div>`).join('')
    : `<div class="current-note">${escapeHtml(t('noItems', language))}</div>`;
  document.getElementById('lastEntry').textContent = state.journal.length
    ? `${resolveText(state.journal[0].title, language)}\n${resolveText(state.journal[0].body, language)}`
    : t('noEntry', language);
}

export function renderAll(state) {
  setStaticLanguage(state.language);
  renderLocation(state);
  renderMap(state);
  renderInventory(state);
  renderJournal(state);
  renderResearch(state);
  renderSide(state);
}
