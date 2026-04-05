/**
 * ローカル開発・デモ本番ドメイン向けの振り分けに使う。
 * （Rails API の demo 振り分けは apiBaseUrlFromHost が demo ドメインのみなので別ルール）
 */
export function isLocalhostOrDemoDeploy(hostname: string | null | undefined): boolean {
  const h = (hostname ?? '').split(':')[0].toLowerCase();
  return h === 'localhost' || h === '127.0.0.1' || h === 'demo.secondpath-app.jp';
}
