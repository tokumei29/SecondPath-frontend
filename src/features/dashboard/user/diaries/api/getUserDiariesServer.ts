import { cache } from 'react';
import { serverFetchJson } from '@/api/serverFetch';

export const getUserDiariesServer = cache(async () => {
  const json = await serverFetchJson<any>('/diaries', { revalidateSeconds: 900 });
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  if (json && Array.isArray(json.diaries)) return json.diaries;
  return [];
});
