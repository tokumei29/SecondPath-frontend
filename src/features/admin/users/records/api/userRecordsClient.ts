import apiClient from '@/api/client';

export const getUserRecords = async (userId: string) => {
  return await apiClient.get(`/admin/users/${userId}/user_records`);
};

export const createUserRecord = async (userId: string, date: string, content: string) => {
  return await apiClient.post(`/admin/users/${userId}/user_records`, {
    date,
    content,
  });
};

export const updateUserRecord = async (recordId: string, content: string) => {
  return await apiClient.patch(`/admin/user_records/${recordId}`, { content });
};

export const deleteUserRecord = async (recordId: string) => {
  return await apiClient.delete(`/admin/user_records/${recordId}`);
};
