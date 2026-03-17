import { cache } from 'react';
import apiClient from '@/api/client';

export const getPublicPostServer = cache(async (id: number) => {
  const response = await apiClient.get(`/posts/${id}`);
  const json = response.data;
  if (json && json.post) return json.post;
  if (json && json.data) return json.data;
  return json;
});
