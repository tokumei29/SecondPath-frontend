import apiClient from '@/api/client';

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

export const getAdminMemos = async (searchQuery?: string): Promise<MemoResponse[]> => {
  const response = await apiClient.get('/admin/memos', {
    params: { q: searchQuery },
  });
  return response.data;
};

export const createAdminMemo = async (data: MemoPayload): Promise<MemoResponse> => {
  const response = await apiClient.post('/admin/memos', data);
  return response.data;
};

export const updateAdminMemo = async (memoId: string, data: MemoPayload): Promise<MemoResponse> => {
  const response = await apiClient.patch(`/admin/memos/${memoId}`, data);
  return response.data;
};

export const deleteAdminMemo = async (memoId: string): Promise<void> => {
  await apiClient.delete(`/admin/memos/${memoId}`);
};
