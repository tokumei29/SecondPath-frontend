import { cache } from 'react';
import { serverFetchJson } from '@/api/serverFetch';
import { Profile } from '@/features/types/profile';

export const getProfileForTextSupportServer = cache(async (): Promise<Profile | null> => {
  const res = await serverFetchJson<Profile | null>('/profile', { revalidateSeconds: 600 });
  if (!res) return null;
  return res;
});
