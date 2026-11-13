import { game, resetState, replaceState } from './core/gameState.js';
import { travel } from './systems/navigation.js';
import { inspectItem, inspectLocation } from './systems/investigation.js';
import { chooseEnding } from './systems/ending.js';
import { downloadSave, readSaveFile } from './systems/saveManager.js';
import { renderAll, setView } from './ui/render.js';
import { showToast, leaveIntro } from './ui/dom.js';
import { t } from './core/i18n.js';
import { locationToast, itemToast } from './ui/toasts.js';
import { markResearchRead, isSecondPhaseUnlocked } from './systems/research.js';

const loadFileInput = document.getElementById('loadFileInput');

function updateSaveStatus(message) {
  document.getElementById('saveStatus').textContent = message;
}

function handleTravel(destinationId) {
  if (travel(game.state, destinationId)) setView(game.state, game.state.view || 'field');
}

function handleLocationInspection() {
  const result = inspectLocation(game.state, game.state.current);
  renderAll(game.state);
  if (result.message === 'endingReady') setView(game.state, 'map');
  const message = locationToast(result.message, game.state.language);
  if (message) showToast(message);
}

function handleItemInspection(itemId) {
  const result = inspectItem(game.state, itemId);
  if (!result.changed) return;
  renderAll(game.state);
  if (result.message === 'endingReady') setView(game.state, 'map');
  const message = itemToast(result.message, game.state.language);
  if (message) showToast(message);
}

async function handleSaveImport(file) {
  if (!file) return;
  try {
    const importedState = await readSaveFile(file);
    const accepted = window.confirm(t('confirmImport', game.state.language));
    if (!accepted) return;
    replaceState(importedState);
    updateSaveStatus(`${t('loadedFile', game.state.language)}${file.name}`);
    leaveIntro();
    setView(game.state, game.state.view || 'field');
    showToast(t('loadSuccess', game.state.language));
  } catch (error) {
    console.error(error);
    showToast(error?.message || t('loadFailure', game.state.language));
  }
}

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.matches('[data-view]')) {
    setView(game.state, button.dataset.view);
    return;
  }
  if (button.id === 'introStartBtn') {
    leaveIntro();
    return;
  }
  if (button.id === 'introLoadBtn') {
    loadFileInput.click();
    return;
  }
  if (button.id === 'languageBtn' || button.id === 'introLanguageBtn') {
    game.state.language = game.state.language === 'ja' ? 'ko' : 'ja';
    renderAll(game.state);
    return;
  }
  if (button.id === 'saveBtn') {
    try {
      downloadSave(game.state);
      updateSaveStatus(t('saveRequested', game.state.language));
      showToast(t('saveSuccess', game.state.language));
    } catch (error) {
      console.error(error);
      showToast(t('saveFailure', game.state.language));
    }
    return;
  }
  if (button.id === 'loadBtn') {
    loadFileInput.click();
    return;
  }
  if (button.id === 'resetBtn') {
    if (!window.confirm(t('confirmReset', game.state.language))) return;
    const currentLanguage = game.state.language;
    resetState();
    game.state.language = currentLanguage;
    updateSaveStatus(t('resetReady', game.state.language));
    setView(game.state, 'field');
    showToast(t('resetSuccess', game.state.language));
    return;
  }
  if (button.id === 'inspectBtn') {
    handleLocationInspection();
    return;
  }
  if (button.dataset.readResearch) {
    const wasUnlocked = isSecondPhaseUnlocked(game.state);
    if (markResearchRead(game.state, button.dataset.readResearch)) {
      renderAll(game.state);
      if (!wasUnlocked && isSecondPhaseUnlocked(game.state)) {
        showToast(t('toastPhase2Unlocked', game.state.language));
      }
    }
    return;
  }
  if (button.dataset.endingChoice) {
    if (chooseEnding(game.state, button.dataset.endingChoice)) renderAll(game.state);
    return;
  }

  const destinationId = button.dataset.go || button.dataset.node || button.dataset.mapGo;
  if (destinationId) {
    handleTravel(destinationId);
    return;
  }
  if (button.dataset.itemInspect) handleItemInspection(button.dataset.itemInspect);
});

loadFileInput.addEventListener('change', async event => {
  const file = event.target.files?.[0];
  await handleSaveImport(file);
  loadFileInput.value = '';
});

renderAll(game.state);
setView(game.state, game.state.view || 'field');
