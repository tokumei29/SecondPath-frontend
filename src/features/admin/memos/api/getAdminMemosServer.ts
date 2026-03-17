import { cache } from 'react';
import apiClient from '@/api/client';
import type { MemoResponse } from '@/features/admin/memos/api/memosClient';

export const getAdminMemosServer = cache(async (): Promise<MemoResponse[]> => {
  const response = await apiClient.get('/admin/memos');
  const json = response.data;
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  if (json && Array.isArray(json.memos)) return json.memos;
  return [];
});
