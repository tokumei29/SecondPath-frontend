const JST = 'Asia/Tokyo';

/**
 * メモ・日付入力用。API の ISO（UTC）なら日本の暦日 YYYY-MM-DD に揃える。
 * すでに YYYY-MM-DD のみの文字列はパースせずそのまま（暦日として確定している想定）。
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

/** `<input type="date" />` の value 用（日本暦日 YYYY-MM-DD） */
export const formatDateForInput = (dateString: string | undefined) =>
  toJapanCalendarDateString(dateString);

/**
 * 一覧・モーダル表示用。API の ISO でも常に日本の暦日で ja-JP 表記（例: 2026/04/06）。
 * 端末のタイムゾーンに依存しない。
 */
export function formatJapanLocaleDate(dateString: string | undefined | null): string {
  if (dateString == null || !String(dateString).trim()) return '';
  const s = String(dateString).trim();
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString('ja-JP', {
    timeZone: JST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
