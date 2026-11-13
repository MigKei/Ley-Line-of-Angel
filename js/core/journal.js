// 일지 날짜는 ISO 문자열로 저장하고, 화면에 보일 때 현재 언어로 변환해요.
// 예전 저장 파일의 날짜(이미 표시용 문자열로 저장된 값)는 변환하지 않고 그대로 보여줘요.
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T/;

export function addJournal(state, title, body) {
  state.journal.unshift({
    title,
    body,
    date: new Date().toISOString()
  });
}

export function formatJournalDate(value, language) {
  if (typeof value !== 'string' || !ISO_DATE.test(value)) return value || '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(language === 'ko' ? 'ko-KR' : 'ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });
}
