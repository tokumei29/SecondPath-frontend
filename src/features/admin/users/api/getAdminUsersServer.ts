import { cache } from 'react';
import apiClient from '@/api/client';

export type AdminUserListItem = {
  id: string;
  name?: string | null;
  created_at: string;
};

export const getAdminUsersServer = cache(async (): Promise<AdminUserListItem[]> => {
  const response = await apiClient.get('/admin/users');
  const json = response.data;
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  if (json && Array.isArray(json.users)) return json.users;
  return [];
});
