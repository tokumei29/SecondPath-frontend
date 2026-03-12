import apiClient from './client';
import { Profile } from '../features/types/profile';

/**
 * ログイン中ユーザーのプロフィール情報を取得する
 */
export const getProfile = async () => {
  // GET /api/v1/profile
  const response = await apiClient.get('/profile');
  return response.data;
};

/**
 * ログイン中ユーザーのプロフィール情報を更新する
 */
export const updateProfile = async (profile: Profile) => {
  // PATCH /api/v1/profile
  const response = await apiClient.patch('/profile', {
    profile,
  });
  return response.data;
};
