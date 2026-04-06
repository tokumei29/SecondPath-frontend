import { cache } from 'react';
import { serverFetchJson } from '@/api/serverFetch';

export type AdminUserListItem = {
  id: string;
  name?: string | null;
  created_at: string;
  /** 退会済みのとき ISO8601、未退会は null / undefined */
  account_withdrawn_at?: string | null;
};

export const getAdminUsersServer = cache(async (): Promise<AdminUserListItem[]> => {
  const json = await serverFetchJson<any>('/admin/users');
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  if (json && Array.isArray(json.users)) return json.users;
  return [];
});
