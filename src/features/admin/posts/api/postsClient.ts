import apiClient from '@/api/client';

export type Post = {
  id?: number;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
};

export const createAdminPost = async (post: Post) => {
  const response = await apiClient.post('/admin/posts', {
    post,
  });
  return response.data;
};
