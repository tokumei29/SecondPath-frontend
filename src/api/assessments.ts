import apiClient from './client';

export const getAssessments = async (userId: string) => {
  const response = await apiClient.get(`/users/${userId}/assessments`);
  return response.data;
};

export const createAssessment = async (userId: string, data: any) => {
  const response = await apiClient.post(`/users/${userId}/assessments`, {
    assessment: data,
  });
  return response.data;
};
