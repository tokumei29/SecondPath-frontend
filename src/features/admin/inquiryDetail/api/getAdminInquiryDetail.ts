import { cache } from 'react';
import apiClient from '@/api/client';

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
    const response = await apiClient.get(`/admin/text_supports/${id}`);
    const json = response.data;
    // API が { data: { support, messages } } 形式を返す場合にも対応
    if (json && json.support && Array.isArray(json.messages)) return json;
    if (json && json.data) return json.data;
    return json;
  }
);
