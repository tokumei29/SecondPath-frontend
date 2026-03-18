import { cache } from 'react';
import { serverFetchJson } from '@/api/serverFetch';
import type { MemoResponse } from '@/features/admin/memos/api/memosClient';

export const getAdminMemosServer = cache(async (): Promise<MemoResponse[]> => {
  const json = await serverFetchJson<any>('/admin/memos');
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  if (json && Array.isArray(json.memos)) return json.memos;
  return [];
});
