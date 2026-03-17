import { cache } from 'react';
import apiClient from '@/api/client';

export const getTextSupportDetailServer = cache(async (id: string) => {
  const response = await apiClient.get(`/text_supports/${id}`);
  const json = response.data;
  if (json && json.detail) return json.detail;
  if (json && json.data) return json.data;
  return json;
});
