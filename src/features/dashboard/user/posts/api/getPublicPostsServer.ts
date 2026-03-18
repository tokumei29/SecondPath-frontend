import { cache } from 'react';
import { serverFetchJson } from '@/api/serverFetch';

export const getPublicPostsServer = cache(async () => {
  const json = await serverFetchJson<any>('/posts', { revalidateSeconds: 300 });
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  if (json && Array.isArray(json.posts)) return json.posts;
  return [];
});
