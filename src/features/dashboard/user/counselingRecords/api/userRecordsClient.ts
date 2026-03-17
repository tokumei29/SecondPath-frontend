import apiClient from '@/api/client';

export type CounselingRecord = {
  id: string;
  user_name: string;
  date: string;
  content: string;
};

export const getMyRecords = async (): Promise<CounselingRecord[]> => {
  const response = await apiClient.get('/user_records');
  return response.data;
};

export const getMyRecord = async (id: string): Promise<CounselingRecord> => {
  const response = await apiClient.get(`/user_records/${id}`);
  return response.data;
};
