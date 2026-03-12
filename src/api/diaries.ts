import apiClient from './client';

export type DiaryData = {
  content: string;
  good_thing: string;
  improvement: string;
  tomorrow_goal: string;
};

export type DiaryPayload = {
  diary: DiaryData;
};

/**
 * 特定のユーザーの日報を新規作成する
 */
export const createDiary = async (userId: string, data: DiaryPayload) => {
  // POST /api/v1/users/[UUID]/diaries
  const response = await apiClient.post(`/users/${userId}/diaries`,
    data);
  return response.data;
};

/**
 * 特定のユーザーの日報一覧を取得する
 */
export const getDiaries = async (userId: string) => {
  // GET /api/v1/users/[UUID]/diaries
  const response = await apiClient.get(`/users/${userId}/diaries`);
  return response.data;
};

/*
 * 特定の日報の詳細を取得する
 */
export const getDiary = async (userId: string, diaryId: string) => {
  const response = await apiClient.get(`/users/${userId}/diaries/${diaryId}`);
  return response.data;
};

/*
 * 特定の日報を更新する
 */
export const updateDiary = async (userId: string, diaryId: string, data: DiaryPayload ) => {
  const response = await apiClient.patch(`/users/${userId}/diaries/${diaryId}`,
    data);
  return response.data;
};

/**
 * 特定の日報を削除する
 */
export const deleteDiary = async (userId: string, diaryId: string) => {
  // DELETE /api/v1/users/[UUID]/diaries/[ID]
  const response = await apiClient.delete(`/users/${userId}/diaries/${diaryId}`);
  return response.data;
};