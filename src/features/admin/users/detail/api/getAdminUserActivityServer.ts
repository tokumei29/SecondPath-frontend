import { cache } from 'react';
import apiClient from '@/api/client';

export const getAdminUserActivityServer = cache(async (userId: string) => {
  const response = await apiClient.get(`/admin/users/${userId}/activity`);
  return response.data;
});
