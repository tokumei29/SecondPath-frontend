/**
 * ローカル開発・デモ本番ドメインでは NEXT_PUBLIC_ADMIN_PASSWORD_DEMO でログインする。
 * （API の振り分けは apiBaseUrlFromHost と独立）
 */
export function shouldUseDemoAdminPassword(hostname: string | null | undefined): boolean {
  const h = (hostname ?? '').split(':')[0].toLowerCase();
  return h === 'localhost' || h === '127.0.0.1' || h === 'demo.secondpath-app.jp';
}
