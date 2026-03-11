import apiClient from './client';
import { Profile } from '../features/types/profile';

/**
 * プロフィール情報を取得する
 */
export const getProfile = async (): Promise<Profile> => {
  const response = await apiClient.get<Profile>('/profile');
  return response.data;
};

/**
 * プロフィール情報を更新する
 */
export const updateProfile = async (profile: Profile): Promise<Profile> => {
  const response = await apiClient.patch<Profile>('/profile', {
    profile,
  });
  return response.data;
};
