import apiClient from './client';

// 全ユーザー一覧の取得
export const getAllUsers = async (query?: string) => {
  // queryが存在する場合、/admin/users?q=xxx という形式で送る
  const response = await apiClient.get('/admin/users', {
    params: { q: query }
  });
  return response.data;
};

// 特定ユーザーの活動詳細（プロフィール、日記、アセスメント）の取得
export const getUserActivity = async (userId: string) => {
  const response = await apiClient.get(`/admin/users/${userId}/activity`);
  return response.data;
};
