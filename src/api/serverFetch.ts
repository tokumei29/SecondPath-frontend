import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn('NEXT_PUBLIC_API_BASE_URL is not set. serverFetch will likely fail.');
}

type ServerFetchOptions = RequestInit & {
  revalidateSeconds?: number;
};

export async function serverFetchJson<T>(
  path: string,
  options: ServerFetchOptions = {}
): Promise<T> {
  const { revalidateSeconds, ...init } = options;

  const cookieStore = await cookies();
  const uuid = cookieStore.get('user_uuid')?.value;

  const url = `${API_BASE_URL ?? ''}${path}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers || {}),
    ...(uuid ? { 'X-User-Id': uuid } : {}),
  };

  const res = await fetch(url, {
    ...init,
    headers,
    cache: revalidateSeconds ? 'force-cache' : 'no-store',
    next: revalidateSeconds ? { revalidate: revalidateSeconds } : undefined,
  });

  if (!res.ok) {
    throw new Error(`serverFetchJson failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}
