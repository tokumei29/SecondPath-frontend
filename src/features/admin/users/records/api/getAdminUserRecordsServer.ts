import { cache } from 'react';
import { serverFetchJson } from '@/api/serverFetch';

export const getAdminUserRecordsServer = cache(async (userId: string) => {
  return await serverFetchJson<any>(`/admin/users/${userId}/user_records`, {
    revalidateSeconds: 300,
  });
});
