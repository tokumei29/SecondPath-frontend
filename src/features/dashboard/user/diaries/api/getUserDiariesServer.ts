import { cache } from 'react';
import apiClient from '@/api/client';

export const getUserDiariesServer = cache(async () => {
  const response = await apiClient.get('/diaries');
  const json = response.data;
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  if (json && Array.isArray(json.diaries)) return json.diaries;
  return [];
});
