import { cache } from 'react';
import { serverFetchJson } from '@/api/serverFetch';

export const getUserDiaryServer = cache(async (diaryId: string) => {
  const json = await serverFetchJson<any>(`/diaries/${diaryId}`);
  if (json && json.diary) return json.diary;
  if (json && json.data) return json.data;
  return json;
});
