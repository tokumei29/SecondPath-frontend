import { cache } from 'react';
import apiClient from '@/api/client';

export const getTextSupportsServer = cache(async () => {
  const response = await apiClient.get('/text_supports');
  const json = response.data;
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  if (json && Array.isArray(json.supports)) return json.supports;
  return [];
});
