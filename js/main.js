import { game, resetState, replaceState } from './core/gameState.js';
import { travel } from './systems/navigation.js';
import { inspectItem, inspectLocation } from './systems/investigation.js';
import { downloadSave, readSaveFile } from './systems/saveManager.js';
import { renderAll, setView } from './ui/render.js';
import { showToast } from './ui/dom.js';
import { t, itemText } from './core/i18n.js';

const loadFileInput = document.getElementById('loadFileInput');

function updateSaveStatus(message) {
  document.getElementById('saveStatus').textContent = message;
}

function handleTravel(destinationId) {
  if (travel(game.state, destinationId)) renderAll(game.state);
}

function handleLocationInspection() {
  const result = inspectLocation(game.state, game.state.current);
  renderAll(game.state);
  if (result.message === 'ending') showToast(t('toastEnding', game.state.language));
  else if (result.message === 'well') showToast(t('toastWell', game.state.language));
  else if (result.message === 'location') showToast(t('toastLocation', game.state.language));
  else if (result.message === 'journal') showToast(t('toastJournal', game.state.language));
  else if (result.message === 'already') showToast(t('toastAlready', game.state.language));
  else if (result.message === 'notReady') showToast(t('toastNotReady', game.state.language));
}

function handleItemInspection(itemId) {
  const result = inspectItem(game.state, itemId);
  if (!result.changed) return;
  renderAll(game.state);
  if (result.message) showToast(`${itemText(result.message, 'name', game.state.language)}${game.state.language === 'ja' ? 'の詳細を記録しました。' : '의 세부 사항을 기록했어요.'}`);
}

async function handleSaveImport(file) {
  if (!file) return;
  try {
    const importedState = await readSaveFile(file);
    const accepted = window.confirm(t('confirmImport', game.state.language));
    if (!accepted) return;
    replaceState(importedState);
    updateSaveStatus(game.state.language === 'ja' ? `読み込んだファイル：${file.name}` : `불러온 파일: ${file.name}`);
    setView(game.state, 'field');
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
  if (button.id === 'languageBtn') {
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
setView(game.state, 'field');
