import apiClient from './client';

// カルテ一覧を取得
export const getUserRecords = async (userId: string) => {
  // Railsのパス: /api/v1/admin/users/:user_id/user_records
  return await apiClient.get(`/admin/users/${userId}/user_records`);
};

// カルテを新規保存
export const createUserRecord = async (userId: string, date: string, content: string) => {
  return await apiClient.post(`/admin/users/${userId}/user_records`, {
    date: date,
    content: content,
  });
};
