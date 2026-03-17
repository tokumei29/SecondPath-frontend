import { cache } from 'react';
import apiClient from '@/api/client';
import { Profile } from '@/features/types/profile';

export const getProfileForTextSupportServer = cache(async (): Promise<Profile | null> => {
  const response = await apiClient.get('/profile');
  const res = response.data;
  if (!res) return null;
  return res as Profile;
});
