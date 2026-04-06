import axios from 'axios';
import apiClient from '@/api/client';
import type { Profile } from '@/features/types/profile';

export const getProfile = async () => {
  const response = await apiClient.get('/profile');
  return response.data;
};

export const updateProfile = async (profile: Partial<Profile>) => {
  try {
    const response = await apiClient.patch('/profile', {
      profile,
    });
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('[updateProfile] PATCH /profile failed', {
        status: err.response?.status,
        data: err.response?.data,
      });
    } else {
      console.error('[updateProfile] PATCH /profile failed', err);
    }
    throw err;
  }
};
