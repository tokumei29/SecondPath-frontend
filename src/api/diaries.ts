import apiClient from './client';

export const createDiary = async (content: string, mood: string = 'normal') => {
  const response = await apiClient.post('/diaries', {
    diary: {
      content,
      mood,
    },
  });
  return response.data;
};
