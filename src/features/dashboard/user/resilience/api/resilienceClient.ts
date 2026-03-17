import apiClient from '@/api/client';

export const createResilienceAssessment = async (data: any) => {
  const response = await apiClient.post('/resilience_assessments', {
    resilience_assessment: data,
  });
  return response.data;
};
