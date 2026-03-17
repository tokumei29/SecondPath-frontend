import { cache } from 'react';
import apiClient from '@/api/client';

export const getUserDiaryServer = cache(async (diaryId: string) => {
  const response = await apiClient.get(`/diaries/${diaryId}`);
  const json = response.data;
  if (json && json.diary) return json.diary;
  if (json && json.data) return json.data;
  return json;
});
