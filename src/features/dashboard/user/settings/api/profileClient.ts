import apiClient from '@/api/client';
import type { Profile } from '@/features/types/profile';

export const getProfile = async () => {
  const response = await apiClient.get('/profile');
  return response.data;
};

export const updateProfile = async (profile: Partial<Profile>) => {
  const response = await apiClient.patch('/profile', {
    profile,
  });
  return response.data;
};
