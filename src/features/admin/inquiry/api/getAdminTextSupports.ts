import { cache } from 'react';
import { serverFetchJson } from '@/api/serverFetch';

export type AdminTextSupportListItem = {
  id: string | number;
  status: 'waiting' | 'replied' | string;
  created_at: string;
  user_id: string;
  name?: string | null;
  email?: string | null;
  subject?: string | null;
  message?: string | null;
};

export const getAdminTextSupports = cache(async (): Promise<AdminTextSupportListItem[]> => {
  const json = await serverFetchJson<any>('/admin/text_supports', { revalidateSeconds: 900 });
  // API が { data: [...] } 形式を返す場合にも対応
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  if (json && Array.isArray(json.supports)) return json.supports;
  return [];
});
