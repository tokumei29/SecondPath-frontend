import { cache } from 'react';
import { serverFetchJson } from '@/api/serverFetch';

export const getAdminUserActivityServer = cache(async (userId: string) => {
  return await serverFetchJson<any>(`/admin/users/${userId}/activity`, {
    revalidateSeconds: 300,
  });
});
