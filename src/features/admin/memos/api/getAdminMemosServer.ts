import { cache } from 'react';
import { cookies } from 'next/headers';
import type { MemoResponse } from '@/api/memos';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getAdminMemosServer = cache(async (): Promise<MemoResponse[]> => {
  if (!baseUrl) throw new Error('NEXT_PUBLIC_API_URL is not set');

  const cookieStore = await cookies();
  const uuid = cookieStore.get('user_uuid')?.value;

  const res = await fetch(`${baseUrl}/admin/memos`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(uuid ? { 'X-User-Id': uuid } : {}),
    },
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch admin memos: ${res.status}`);
  }

  const json = await res.json();
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  if (json && Array.isArray(json.memos)) return json.memos;
  return [];
});
