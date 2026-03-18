import { cache } from 'react';
import { serverFetchJson } from '@/api/serverFetch';

export const getTextSupportsServer = cache(async () => {
  const json = await serverFetchJson<any>('/text_supports');
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  if (json && Array.isArray(json.supports)) return json.supports;
  return [];
});
