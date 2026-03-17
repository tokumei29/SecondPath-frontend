import apiClient from '@/api/client';

export const getAllTextSupports = async () => {
  const response = await apiClient.get('/admin/text_supports');
  return response.data;
};

export const getInquiryDetail = async (id: string | number) => {
  const response = await apiClient.get(`/admin/text_supports/${id}`);
  return response.data;
};

export const postReply = async (id: string | number, body: string) => {
  const response = await apiClient.post(`/admin/text_supports/${id}/reply`, {
    body,
  });
  return response.data;
};

export const getInquiryStats = async () => {
  const response = await apiClient.get('/admin/text_supports/stats');
  return response.data;
};
