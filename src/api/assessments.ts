import apiClient from './client';

// PHQ-9 用
export const createPhq9Assessment = async (data: any) => {
  const response = await apiClient.post('/phq9_assessments', {
    phq9_assessment: data,
  });
  return response.data;
};

export const getPhq9Assessments = async () => {
  const response = await apiClient.get('/phq9_assessments');
  return response.data;
};

// レジリエンス用
export const getResilienceHistory = async () => {
  const res = await apiClient.get('/resilience_assessments');
  return res.data;
};

export const createResilienceAssessment = async (data: any) => {
  const response = await apiClient.post('/resilience_assessments', {
    resilience_assessment: data,
  });
  return response.data;
};

// 認知の歪み用
export const createCognitiveDistortionAssessment = async (data: any) => {
  const response = await apiClient.post('/cognitive_distortion_assessments', {
    cognitive_distortion_assessment: data,
  });
  return response.data;
};

export const getCognitiveDistortionHistory = async () => {
  const response = await apiClient.get('/cognitive_distortion_assessments');
  return response.data;
};
