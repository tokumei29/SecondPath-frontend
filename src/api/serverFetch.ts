import { cookies, headers } from 'next/headers';
import { apiBaseUrlFromHost } from '@/lib/apiBaseUrl';

type ServerFetchOptions = RequestInit;

export async function serverFetchJson<T>(
  path: string,
  options: ServerFetchOptions = {}
): Promise<T> {
  const init = options;
  const cookieStore = await cookies();
  const uuid = cookieStore.get('user_uuid')?.value;

  const headerList = await headers();
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host');
  const base = apiBaseUrlFromHost(host);
  if (!base) {
    throw new Error('API base URL could not be resolved from request host.');
  }

  const url = `${base}${path}`;

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers || {}),
    ...(uuid ? { 'X-User-Id': uuid } : {}),
  };

  const res = await fetch(url, {
    ...init,
    headers: requestHeaders,
    // 初期フェッチ時は常に最新を取りにいく
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`serverFetchJson failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}
