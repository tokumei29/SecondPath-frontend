import apiClient from './client';
import { Profile } from '../features/types/profile';

/**
 * プロフィール情報を取得する
 */
export const getProfile = async (userId: string) => {
  // GET /api/v1/users/[UUID]/profile
  const response = await apiClient.get(`/users/${userId}/profile`);
  return response.data;
};

/**
 * プロフィール情報を更新する
 */
export const updateProfile = async (userId: string, profile: Profile) => {
  // PATCH /api/v1/users/[UUID]/profile
  const response = await apiClient.patch(`/users/${userId}/profile`, {
    profile,
  });
  return response.data;
};
