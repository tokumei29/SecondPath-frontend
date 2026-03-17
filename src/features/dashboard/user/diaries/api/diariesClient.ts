import apiClient from '@/api/client';

export type DiaryData = {
  content: string;
  good_thing: string;
  improvement: string;
  tomorrow_goal: string;
  mood?: number;
};

export type DiaryPayload = {
  diary: DiaryData;
};

export const createDiary = async (data: DiaryPayload) => {
  const response = await apiClient.post('/diaries', data);
  return response.data;
};

export const updateDiary = async (diaryId: string, data: DiaryPayload) => {
  const response = await apiClient.patch(`/diaries/${diaryId}`, data);
  return response.data;
};

export const deleteDiary = async (diaryId: string) => {
  const response = await apiClient.delete(`/diaries/${diaryId}`);
  return response.data;
};
