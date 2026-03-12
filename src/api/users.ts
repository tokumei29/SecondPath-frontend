import apiClient from './client';

// 全ユーザー一覧の取得
export const getAllUsers = async () => {
  const response = await apiClient.get('/admin/users');
  return response.data;
};

// 特定ユーザーの活動詳細（プロフィール、日記、アセスメント）の取得
export const getUserActivity = async (userId: string) => {
  const response = await apiClient.get(`/admin/users/${userId}/activity`);
  return response.data;
};
