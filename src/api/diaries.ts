import apiClient from './client';

export type DiaryData = {
  content: string;
  good_thing: string;
  improvement: string;
  tomorrow_goal: string;
};

/**
 * 特定のユーザーの日報を新規作成する
 */
export const createDiary = async (userId: string, content: string) => {
  // POST /api/v1/users/[UUID]/diaries
  const response = await apiClient.post(`/users/${userId}/diaries`, {
    diary: {
      content: content,
    },
  });
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
export const updateDiary = async (userId: string, diaryId: string, data: { diary: DiaryData }) => {
  const response = await apiClient.patch(`/users/${userId}/diaries/${diaryId}`, {
    diary: data,
  });
  return response.data;
};
