import { cache } from 'react';
import apiClient from '@/api/client';

export const getPublicPostsServer = cache(async () => {
  const response = await apiClient.get('/posts');
  const json = response.data;
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  if (json && Array.isArray(json.posts)) return json.posts;
  return [];
});
