import { cache } from 'react';
import { serverFetchJson } from '@/api/serverFetch';

export const getPhq9AssessmentsServer = cache(async () => {
  const json = await serverFetchJson<any>('/phq9_assessments', { revalidateSeconds: 900 });
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  return [];
});
