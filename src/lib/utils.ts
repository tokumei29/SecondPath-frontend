const JST = 'Asia/Tokyo';

/**
 * API の ISO（UTC）を日本の暦日 YYYY-MM-DD に揃える。
 * すでに YYYY-MM-DD のみの文字列はそのまま（暦日として確定している想定）。
 */
export function toJapanCalendarDateString(dateString: string | undefined | null): string {
  if (dateString == null || !String(dateString).trim()) return '';
  const s = String(dateString).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  const d = new Date(s);
  if (Number.isNaN(d.getTime())) {
    const head = s.split('T')[0];
    return /^\d{4}-\d{2}-\d{2}$/.test(head) ? head : s;
  }

  return new Intl.DateTimeFormat('en-CA', {
    timeZone: JST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

/** `<input type="date" />` の value 用（常に日本暦日 YYYY-MM-DD） */
export const formatDateForInput = (dateString: string | undefined) =>
  toJapanCalendarDateString(dateString);

/**
 * 一覧・モーダル表示用。日本暦日を JST 正午として解釈し ja-JP 表記（例: 2026/04/06）。
 */
export function formatJapanLocaleDate(dateString: string | undefined | null): string {
  if (dateString == null || !String(dateString).trim()) return '';
  const s = String(dateString).trim();
  const ymd = toJapanCalendarDateString(s);
  if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
    const d = new Date(`${ymd}T12:00:00+09:00`);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString('ja-JP', {
        timeZone: JST,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    }
  }
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString('ja-JP', {
    timeZone: JST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
