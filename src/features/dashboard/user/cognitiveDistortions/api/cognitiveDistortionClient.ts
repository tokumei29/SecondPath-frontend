import apiClient from '@/api/client';

export const createCognitiveDistortionAssessment = async (data: any) => {
  const response = await apiClient.post('/cognitive_distortion_assessments', {
    cognitive_distortion_assessment: data,
  });
  return response.data;
};
