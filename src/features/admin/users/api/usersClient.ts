import apiClient from '@/api/client';

export const getAllUsers = async (query?: string) => {
  const response = await apiClient.get('/admin/users', {
    params: { q: query },
  });
  return response.data;
};
