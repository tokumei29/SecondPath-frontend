import { cache } from 'react';
import apiClient from '@/api/client';

export const getCognitiveDistortionHistoryServer = cache(async () => {
  const response = await apiClient.get('/cognitive_distortion_assessments');
  const json = response.data;
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  return [];
});
