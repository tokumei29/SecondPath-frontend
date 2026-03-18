import { cache } from 'react';
import { serverFetchJson } from '@/api/serverFetch';

export const getCognitiveDistortionHistoryServer = cache(async () => {
  const json = await serverFetchJson<any>('/cognitive_distortion_assessments');
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  return [];
});
