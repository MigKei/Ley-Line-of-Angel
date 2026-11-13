export function addJournal(state, title, body) {
  state.journal.unshift({
    title,
    body,
    date: new Date().toLocaleString(state.language === 'ko' ? 'ko-KR' : 'ja-JP', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    })
  });
}
