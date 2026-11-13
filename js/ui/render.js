import { LOCATIONS, MAP_GROUPS, REQUIRED_LOCATIONS, PHASE2_LOCATIONS } from '../data/locations.js';
import { ITEMS } from '../data/items.js';
import { RESEARCH_RECORDS } from '../data/researchRecords.js';
import { ENDING_SCENE } from '../data/endingScene.js';
import {
  isLocationInspected, hasItem, isItemInspected,
  locationProgress, itemProgress
} from '../core/gameState.js';
import { getResearchProgress, isResearchUnlocked, getResearchThreshold, isSecondPhaseUnlocked, phase2LocationProgress } from '../systems/research.js';
import { escapeHtml } from './dom.js';
import { formatJournalDate } from '../core/journal.js';
import { t, locationText, phase2Text, itemText, groupText, resolveText, setStaticLanguage } from '../core/i18n.js';

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
  if (id === 'unknown') return state.endingInspected ? t('inspected', state.language) : t('visited', state.language);
  if (PHASE2_LOCATIONS.includes(id)) {
    if (state.inspectedPhase2.includes(id)) return t('phase2Done', state.language);
    if (isLocationInspected(state, id)) {
      if (!isSecondPhaseUnlocked(state)) return t('phase1Done', state.language);
      return state.phase2Visited.includes(id)
        ? t('phase2Ready', state.language)
        : t('phase2NeedsVisit', state.language);
    }
  }
  if (isLocationInspected(state, id)) return t('inspected', state.language);
  if (state.visited.includes(id)) return t('visited', state.language);
  return t('unvisited', state.language);
}

function renderUnknownLocation(state) {
  const language = state.language;
  const body = [];
  body.push(`<div class="location-kicker">${escapeHtml(locationText('unknown', 'category', language))}</div>`);
  body.push(`<h2>???</h2><div class="location-en">UNKNOWN</div><div class="ornament">— · — · —</div>`);

  if (!state.endingInspected && !state.ended) {
    body.push(`<div class="description">${escapeHtml(resolveText(ENDING_SCENE.description, language))}</div>`);
    body.push(`<div class="investigate-row"><button class="action" id="inspectBtn">${escapeHtml(t('endingInspectButton', language))}</button><span class="hint">${escapeHtml(t('inspectHint', language))}</span></div>`);
  } else if (state.endingInspected && !state.ended) {
    body.push(`<div class="observation">${escapeHtml(resolveText(ENDING_SCENE.investigation, language))}</div>`);
    body.push(`<div class="ending-choices"><button class="action" data-ending-choice="remove">${escapeHtml(t('endingChoiceRemove', language))}</button><button class="action secondary" data-ending-choice="accept">${escapeHtml(t('endingChoiceAccept', language))}</button></div>`);
  } else {
    const endingText = state.endingChoice === 'remove' ? ENDING_SCENE.remove : ENDING_SCENE.accept;
    body.push(`<div class="ending"><p>${escapeHtml(resolveText(endingText, language))}</p><div class="ending-mark">THE END · LEY LINE OF ANGEL</div></div>`);
  }

  document.getElementById('locationStatus').textContent = statusText(state, 'unknown');
  document.getElementById('locationContent').innerHTML = body.join('');
}

function renderLocation(state) {
  const language = state.language;
  const id = state.current;
  if (id === 'unknown') {
    renderUnknownLocation(state);
    return;
  }

  const place = LOCATIONS[id];
  const inspected = isLocationInspected(state, id);
  const isPhase2Place = PHASE2_LOCATIONS.includes(id);
  const phase2Unlocked = isSecondPhaseUnlocked(state);
  const phase2Visited = state.phase2Visited.includes(id);
  const phase2Done = state.inspectedPhase2.includes(id);
  const showingPhase2 = isPhase2Place && inspected && phase2Unlocked && phase2Visited;
  document.getElementById('locationStatus').textContent = statusText(state, id);

  let body = `<div class="location-kicker">${escapeHtml(locationText(id, 'category', language))}</div>`;
  body += `<h2>${escapeHtml(locationText(id, 'name', language))}</h2><div class="location-en">${escapeHtml(place.en)}</div>`;
  body += '<div class="ornament">— · — · —</div>';

  if (showingPhase2) {
    body += `<div class="phase-label">${escapeHtml(t('phase2Label', language))}</div>`;
    body += `<div class="description">${escapeHtml(phase2Text(id, 'beforeText', language))}</div>`;
    if (phase2Done) {
      body += `<div class="observation"><span class="label">${escapeHtml(t('labelObservation', language))}</span>${escapeHtml(phase2Text(id, 'inspectText', language))}</div>`;
    }
    if (!state.endingUnlocked && !state.ended && !phase2Done) {
      body += `<div class="investigate-row"><button class="action" id="inspectBtn">${escapeHtml(t('phase2InspectButton', language))}</button><span class="hint">${escapeHtml(t('inspectHint', language))}</span></div>`;
    }
  } else {
    body += `<div class="description">${escapeHtml(locationText(id, 'description', language))}</div>`;
    if (place.afterText && inspected) {
      body += `<div class="observation"><span class="label">${escapeHtml(t('labelAfter', language))}</span>${escapeHtml(locationText(id, 'afterText', language))}</div>`;
    }
    if (inspected) {
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
      if (isPhase2Place && phase2Unlocked && !phase2Visited) {
        body += `<div class="phase-note">${escapeHtml(t('phase2Revisit', language))}</div>`;
      } else if (isPhase2Place && !phase2Unlocked) {
        body += `<div class="phase-note">${escapeHtml(t('phase2NotUnlocked', language))}</div>`;
      }
    }

    if (!state.endingUnlocked && !state.ended && !inspected) {
      const label = locationText(id, 'inspectLabel', language) || t('inspectButton', language);
      const hint = id === 'outskirts' && !hasItem(state, 'seed') ? t('seedPickupHint', language) : t('inspectHint', language);
      body += `<div class="investigate-row"><button class="action" id="inspectBtn">${escapeHtml(label)}</button><span class="hint">${escapeHtml(hint)}</span></div>`;
    } else if (!state.endingUnlocked && !state.ended && isPhase2Place && inspected && phase2Unlocked && !phase2Visited) {
      body += `<div class="investigate-row"><button class="action" id="inspectBtn" disabled>${escapeHtml(t('phase2InspectButton', language))}</button><span class="hint">${escapeHtml(t('phase2Revisit', language))}</span></div>`;
    }
  }

  const connections = state.endingUnlocked
    ? ''
    : place.connections.map(next => `<button class="move" data-go="${next}">${escapeHtml(locationText(next, 'name', language))}</button>`).join('');
  if (connections) {
    body += `<div class="movement"><div class="movement-head"><span class="movement-title">${escapeHtml(t('movement', language))}</span><span class="smallcaps">${place.connections.length} ${escapeHtml(t('routes', language))}</span></div><div class="move-grid">${connections}</div></div>`;
  }
  document.getElementById('locationContent').innerHTML = body;
}

function renderMap(state) {
  const language = state.language;
  const groupsElement = document.getElementById('mapGroups');

  if (state.endingUnlocked) {
    const current = state.current === 'unknown';
    const status = current ? statusText(state, 'unknown') : t('unvisited', language);
    groupsElement.innerHTML = `<section class="map-group"><div class="map-group-title">???</div><div class="map-grid"><button class="node ${current ? 'current' : ''}" data-node="unknown" ${current || state.ended ? 'disabled' : ''}><span class="node-name">???</span><span class="node-meta"><span>${escapeHtml(t('unknownLocation', language))}</span><span>${escapeHtml(status)}</span></span></button></div></section>`;
    document.getElementById('mapCurrent').textContent = current
      ? `${t('currentPrefix', language)}???`
      : t('endingMapOnly', language);
    document.getElementById('mapMoves').innerHTML = current || state.ended
      ? `<span class="empty-move">${escapeHtml(t('noMoves', language))}</span>`
      : `<button class="move" data-map-go="unknown">???</button>`;
    return;
  }

  groupsElement.innerHTML = MAP_GROUPS.map(group => {
    const nodes = group.ids.map(id => {
      const current = id === state.current;
      const status = statusText(state, id);
      const accessible = LOCATIONS[state.current].connections.includes(id);
      const disabled = !accessible && !current;
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
    ? moves.map(id => `<button class="move" data-map-go="${id}">${escapeHtml(locationText(id, 'name', language))}</button>`).join('')
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
    <div class="meta">${escapeHtml(formatJournalDate(entry.date, language) || 'FIELD RECORD')}</div>
    <h3>${escapeHtml(resolveText(entry.title, language))}</h3><p>${escapeHtml(resolveText(entry.body, language))}</p>
  </article>`).join('');
}

function renderResearch(state) {
  const language = state.language;
  const progress = getResearchProgress(state);
  const locationRate = Math.round(progress.locations / progress.locationTotal * 100);
  const phase2Rate = Math.round(progress.phase2Locations / progress.phase2Total * 100);
  const itemRate = Math.round(progress.items / progress.itemTotal * 100);
  document.getElementById('researchProgress').innerHTML = `
    <div class="research-meter">
      <div class="progress-meta"><span>${escapeHtml(t('researchLocationRate', language))}</span><span>${progress.locations}/${progress.locationTotal} · ${locationRate}%</span></div>
      <div class="progress-line"><div class="progress-fill" style="width:${locationRate}%"></div></div>
    </div>
    <div class="research-meter">
      <div class="progress-meta"><span>${escapeHtml(t('researchPhase2Rate', language))}</span><span>${progress.phase2Locations}/${progress.phase2Total} · ${phase2Rate}%</span></div>
      <div class="progress-line"><div class="progress-fill" style="width:${phase2Rate}%"></div></div>
    </div>
    <div class="research-meter">
      <div class="progress-meta"><span>${escapeHtml(t('researchItemRate', language))}</span><span>${progress.items}/${progress.itemTotal} · ${itemRate}%</span></div>
      <div class="progress-line"><div class="progress-fill" style="width:${itemRate}%"></div></div>
    </div>
    <div class="research-total">${escapeHtml(t('researchTotalRate', language))} · ${progress.completed}/${progress.total} · ${progress.percent}%</div>`;

  const visibleRecords = RESEARCH_RECORDS.filter(record => !record.afterEnding || state.ended);
  const cards = visibleRecords.map((record, index) => {
    const unlocked = isResearchUnlocked(state, record);
    const read = Boolean(record.requiresRead && state.researchRead.includes(record.id));
    const body = resolveText(record.body, language).trim();
    const status = !unlocked ? t('researchLocked', language) : read ? t('researchRead', language) : t('researchUnlocked', language);
    const condition = record.afterEnding
      ? t('researchAfterEnding', language)
      : `${t(record.progressBasis === 'firstPhase' ? 'researchFirstPhaseCondition' : 'researchTotalCondition', language)} · ${getResearchThreshold(state, record)}%`;
    const content = !unlocked
      ? t('researchLockedHint', language)
      : record.requiresRead && !read
        ? t('researchNeedRead', language)
        : body;
    const readButton = unlocked && record.requiresRead && !read
      ? `<button class="research-read" data-read-research="${escapeHtml(record.id)}">${escapeHtml(t('researchOpenButton', language))}</button>`
      : '';
    return `<article class="research-card ${unlocked ? 'unlocked' : 'locked'} ${read ? 'read' : ''}">
      <div class="research-card-head"><span class="research-index">${String(index + 1).padStart(2, '0')}</span><span class="research-status">${escapeHtml(status)}</span></div>
      <h3>${escapeHtml(resolveText(record.title, language))}</h3>
      <p>${escapeHtml(content)}</p>
      ${readButton}
      <div class="research-condition">${escapeHtml(condition)}</div>
    </article>`;
  }).join('');
  document.getElementById('researchList').innerHTML = cards || `<div class="empty-state">${escapeHtml(t('emptyResearch', language))}</div>`;
}

function renderSide(state) {
  const language = state.language;
  const count = locationProgress(state, REQUIRED_LOCATIONS);
  const phase2Count = phase2LocationProgress(state);
  const itemCount = itemProgress(state);
  document.getElementById('progressText').textContent = `${count} / ${REQUIRED_LOCATIONS.length}`;
  document.getElementById('progressFill').style.width = `${count / REQUIRED_LOCATIONS.length * 100}%`;
  document.getElementById('phase2ProgressText').textContent = `${phase2Count} / ${PHASE2_LOCATIONS.length}`;
  document.getElementById('phase2ProgressFill').style.width = `${phase2Count / PHASE2_LOCATIONS.length * 100}%`;
  document.getElementById('itemProgressText').textContent = `${itemCount} / ${Object.keys(ITEMS).length}`;
  document.getElementById('itemProgressFill').style.width = `${itemCount / Object.keys(ITEMS).length * 100}%`;
  const total = getResearchProgress(state);
  document.getElementById('totalProgressText').textContent = `${total.completed} / ${total.total} · ${total.percent}%`;
  document.getElementById('totalProgressFill').style.width = `${total.percent}%`;
  document.getElementById('seedStatus').textContent = hasItem(state, 'seed')
    ? (isItemInspected(state, 'seed') ? t('inspected', language) : t('carried', language))
    : t('unknown', language);
  document.getElementById('progressNote').textContent = state.ended
    ? t('progressEnded', language)
    : state.endingUnlocked
      ? t('progressReady', language)
      : isSecondPhaseUnlocked(state)
        ? t('phase2UnlockedNote', language)
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
