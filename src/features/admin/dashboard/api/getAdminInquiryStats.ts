import { cache } from 'react';
import { serverFetchJson } from '@/api/serverFetch';

export type AdminInquiryStats = {
  unresolved: number;
  today: number;
};

export const getAdminInquiryStats = cache(async (): Promise<AdminInquiryStats> => {
  return await serverFetchJson<AdminInquiryStats>('/admin/text_supports/stats');
});
