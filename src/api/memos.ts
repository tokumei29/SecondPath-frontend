import apiClient from './client';

export type MemoData = {
  user_name: string;
  date: string;
  content: string;
};

export type MemoPayload = {
  memo: MemoData;
};

export type MemoResponse = MemoData & {
  id: string;
  created_at: string;
  updated_at: string;
};

/**
 * 全てのカウンセリングメモを取得する（管理者用）
 */
export const getAdminMemos = async (): Promise<MemoResponse[]> => {
  // GET /api/v1/admin/memos
  const response = await apiClient.get('/admin/memos');
  return response.data;
};

/**
 * カウンセリングメモを新規作成する
 */
export const createAdminMemo = async (data: MemoPayload): Promise<MemoResponse> => {
  // POST /api/v1/admin/memos
  const response = await apiClient.post('/admin/memos', data);
  return response.data;
};

/**
 * 特定のカウンセリングメモを更新する
 */
export const updateAdminMemo = async (memoId: string, data: MemoPayload): Promise<MemoResponse> => {
  // PATCH /api/v1/admin/memos/[ID]
  const response = await apiClient.patch(`/admin/memos/${memoId}`, data);
  return response.data;
};

/**
 * 特定のカウンセリングメモを削除する
 */
export const deleteAdminMemo = async (memoId: string): Promise<void> => {
  // DELETE /api/v1/admin/memos/[ID]
  await apiClient.delete(`/admin/memos/${memoId}`);
};
