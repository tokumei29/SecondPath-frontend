import { cache } from 'react';
import apiClient from '@/api/client';

export type AdminInquiryStats = {
  unresolved: number;
  today: number;
};

export const getAdminInquiryStats = cache(async (): Promise<AdminInquiryStats> => {
  const response = await apiClient.get('/admin/text_supports/stats');
  return response.data as AdminInquiryStats;
});
