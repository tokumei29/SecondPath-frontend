import apiClient from './client';

// カルテ一覧を取得（管理者）
export const getUserRecords = async (userId: string) => {
  // Railsのパス: /api/v1/admin/users/:user_id/user_records
  return await apiClient.get(`/admin/users/${userId}/user_records`);
};

// カルテを新規保存（管理者）
export const createUserRecord = async (userId: string, date: string, content: string) => {
  return await apiClient.post(`/admin/users/${userId}/user_records`, {
    date: date,
    content: content,
  });
};

// 特定の記録を更新（管理者）
export const updateUserRecord = async (recordId: string, content: string) => {
  return await apiClient.patch(`/admin/user_records/${recordId}`, { content });
};

// 特定の記録を削除（管理者）
export const deleteUserRecord = async (recordId: string) => {
  return await apiClient.delete(`/admin/user_records/${recordId}`);
};

export type CounselingRecord = {
  id: string;
  user_name: string;
  date: string;
  content: string;
};

/**
 * 自分のカウンセリング記録一覧を取得する（ユーザー）
 */
export const getMyRecords = async (): Promise<CounselingRecord[]> => {
  const response = await apiClient.get('/user_records');
  return response.data;
};

/**
 * 特定のカウンセリング記録の詳細を取得する（ユーザー）
 */
export const getMyRecord = async (id: string): Promise<CounselingRecord> => {
  const response = await apiClient.get(`/user_records/${id}`);
  return response.data;
};
