import apiClient from '@/api/client';

export const createPhq9Assessment = async (data: any) => {
  const response = await apiClient.post('/phq9_assessments', {
    phq9_assessment: data,
  });
  return response.data;
};
