import { cache } from 'react';
import { serverFetchJson } from '@/api/serverFetch';

export const getPublicPostServer = cache(async (id: number) => {
  const json = await serverFetchJson<any>(`/posts/${id}`, { revalidateSeconds: 600 });
  if (json && json.post) return json.post;
  if (json && json.data) return json.data;
  return json;
});
