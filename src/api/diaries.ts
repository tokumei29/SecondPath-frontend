import apiClient from './client';

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

/**
 * ログイン中ユーザーの日報を新規作成する
 */
export const createDiary = async (data: DiaryPayload) => {
  // POST /api/v1/diaries
  const response = await apiClient.post('/diaries', data);
  return response.data;
};

/**
 * ログイン中ユーザーの日報一覧を取得する
 */
export const getDiaries = async () => {
  // GET /api/v1/diaries
  const response = await apiClient.get('/diaries');
  return response.data;
};

/**
 * 特定の日報の詳細を取得する
 */
export const getDiary = async (diaryId: string) => {
  const response = await apiClient.get(`/diaries/${diaryId}`);
  return response.data;
};

/**
 * 特定の日報を更新する
 */
export const updateDiary = async (diaryId: string, data: DiaryPayload) => {
  const response = await apiClient.patch(`/diaries/${diaryId}`, data);
  return response.data;
};

/**
 * 特定の日報を削除する
 */
export const deleteDiary = async (diaryId: string) => {
  // DELETE /api/v1/diaries/[ID]
  const response = await apiClient.delete(`/diaries/${diaryId}`);
  return response.data;
};
