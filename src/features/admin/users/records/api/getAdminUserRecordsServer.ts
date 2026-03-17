import { cache } from 'react';
import apiClient from '@/api/client';

export const getAdminUserRecordsServer = cache(async (userId: string) => {
  const response = await apiClient.get(`/admin/users/${userId}/user_records`);
  return response.data;
});
