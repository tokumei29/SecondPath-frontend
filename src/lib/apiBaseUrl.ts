/** 本番 Rails API（Render）。ルートは namespace :api / :v1 のため /api/v1 まで含める */
const PROD_API_DEFAULT = 'https://secondpath-backend.onrender.com/api/v1';
/** デモ用 Rails API（Render） */
const DEMO_API_DEFAULT = 'https://secondpath-backend-1.onrender.com/api/v1';

function normalizeBase(url: string): string {
  return url.replace(/\/$/, '');
}

/**
 * フロントのホストに応じて API ベース URL を返す。
 * - demo.secondpath-app.jp のみ → デモ API（NEXT_PUBLIC_API_URL_DEMO またはデフォルト）
 * - それ以外（localhost 含む）→ NEXT_PUBLIC_API_URL（ローカルではローカル Rails 等）、未設定なら本番デフォルト
 */
export function apiBaseUrlFromHost(host: string | null | undefined): string {
  const hostname = (host ?? '').split(':')[0].toLowerCase();

  if (hostname === 'demo.secondpath-app.jp') {
    return normalizeBase(process.env.NEXT_PUBLIC_API_URL_DEMO ?? DEMO_API_DEFAULT);
  }

  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) return normalizeBase(fromEnv);

  return PROD_API_DEFAULT;
}
