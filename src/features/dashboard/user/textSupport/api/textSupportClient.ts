import apiClient from '@/api/client';

export type TextSupportData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type TextSupportPayload = {
  text_support: TextSupportData;
};

export const createTextSupport = async (payload: TextSupportPayload) => {
  const response = await apiClient.post('/text_supports', payload);
  return response.data;
};

export const getTextSupports = async () => {
  const response = await apiClient.get('/text_supports');
  return response.data;
};

export const getTextSupportDetail = async (id: string | number) => {
  const response = await apiClient.get(`/text_supports/${id}`);
  return response.data;
};

export const postSupportMessage = async (textSupportId: string | number, content: string) => {
  const response = await apiClient.post(`/text_supports/${textSupportId}/add_message`, {
    support_message: {
      message: content,
    },
  });
  return response.data;
};
