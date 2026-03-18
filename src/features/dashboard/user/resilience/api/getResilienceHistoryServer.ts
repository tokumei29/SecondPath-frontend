import { cache } from 'react';
import { serverFetchJson } from '@/api/serverFetch';

export const getResilienceHistoryServer = cache(async () => {
  const json = await serverFetchJson<any>('/resilience_assessments');
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  return [];
});
