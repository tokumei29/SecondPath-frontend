import apiClient from './client';

// PHQ-9 用
export const createPhq9Assessment = async (userId: string, data: any) => {
  const response = await apiClient.post(`/users/${userId}/phq9_assessments`, {
    phq9_assessment: data,
  });
  return response.data;
};

export const getPhq9Assessments = async (userId: string) => {
  const response = await apiClient.get(`/users/${userId}/phq9_assessments`);
  return response.data;
};

// レジリエンス用
export const getResilienceHistory = async (userId: string) => {
  const res = await apiClient.get(`/users/${userId}/resilience_assessments`);
  return res.data;
};

export const createResilienceAssessment = async (userId: string, data: any) => {
  const response = await apiClient.post(`/users/${userId}/resilience_assessments`, {
    resilience_assessment: data,
  });
  return response.data;
};

// 認知の歪み用
export const createCognitiveDistortionAssessment = async (userId: string, data: any) => {
  const response = await apiClient.post(`/users/${userId}/cognitive_distortion_assessments`, {
    cognitive_distortion_assessment: data
  });
  return response.data;
};

export const getCognitiveDistortionHistory = async (userId: string) => {
  const response = await apiClient.get(`/users/${userId}/cognitive_distortion_assessments`);
  return response.data;
};