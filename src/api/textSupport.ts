import apiClient from './client';

export type TextSupportData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type TextSupportPayload = {
  text_support: TextSupportData;
};

/**
 * カウンセラーへのテキストでのお問い合わせ（一般ユーザー用）
 */
export const createTextSupport = async (payload: TextSupportPayload) => {
  // POST /api/v1/text_supports
  const response = await apiClient.post('/text_supports', payload);
  return response.data;
};

/**
 * 1. 【管理者用】すべてのお問い合わせ一覧を取得
 */
export const getAllTextSupports = async () => {
  const response = await apiClient.get('/admin/text_supports');
  return response.data;
};

/**
 * 2. 【管理者用】特定のお問い合わせ詳細とトーク履歴を取得
 */
export const getInquiryDetail = async (id: string | number) => {
  const response = await apiClient.get(`/admin/text_supports/${id}`);
  return response.data;
};

/**
 * 3. 【管理者用】回答（トーク）を送信
 */
export const postReply = async (id: string | number, body: string) => {
  const response = await apiClient.post(`/admin/text_supports/${id}/reply`, {
    body: body,
  });
  return response.data;
};

/**
 * 4. 【管理者用】統計情報の取得
 */
export const getInquiryStats = async () => {
  const response = await apiClient.get('/admin/text_supports/stats');
  return response.data;
};
