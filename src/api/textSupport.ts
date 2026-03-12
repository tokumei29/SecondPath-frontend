import apiClient from './client';

export type TextSupportData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type TextSupportPayload = {
  text_support: TextSupportData; // Railsの名称に合わせる
};

/*
*カウンセラーへのテキストでのお問い合わせ
*/
export const createTextSupport = async (userId: string, payload: TextSupportPayload) => {
  const response = await apiClient.post(`/users/${userId}/text_supports`, payload);
  return response.data;
};