import { cache } from 'react';
import { serverFetchJson } from '@/api/serverFetch';

export type AdminInquiryMessage = {
  id: string | number;
  sender_type: number;
  body: string;
  created_at: string;
};

export type AdminInquirySupport = {
  id: string | number;
  name?: string | null;
  status: number | string;
  subject?: string | null;
  message?: string | null;
  created_at: string;
};

export type AdminInquiryDetail = {
  support: AdminInquirySupport;
  messages: AdminInquiryMessage[];
};

export const getAdminInquiryDetail = cache(
  async (id: string | number): Promise<AdminInquiryDetail> => {
    const json = await serverFetchJson<any>(`/admin/text_supports/${id}`, {
      revalidateSeconds: 300,
    });
    // API が { data: { support, messages } } 形式を返す場合にも対応
    if (json && json.support && Array.isArray(json.messages)) return json;
    if (json && json.data) return json.data;
    return json;
  }
);
