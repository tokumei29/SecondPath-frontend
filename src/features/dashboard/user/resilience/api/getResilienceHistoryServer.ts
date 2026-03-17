import { cache } from 'react';
import apiClient from '@/api/client';

export const getResilienceHistoryServer = cache(async () => {
  const response = await apiClient.get('/resilience_assessments');
  const json = response.data;
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  return [];
});
