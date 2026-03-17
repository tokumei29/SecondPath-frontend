import { cache } from 'react';
import { cookies } from 'next/headers';

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

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getAdminInquiryDetail = cache(
  async (id: string | number): Promise<AdminInquiryDetail> => {
    if (!baseUrl) throw new Error('NEXT_PUBLIC_API_URL is not set');

    const cookieStore = await cookies();
    const uuid = cookieStore.get('user_uuid')?.value;

    const res = await fetch(`${baseUrl}/admin/text_supports/${id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(uuid ? { 'X-User-Id': uuid } : {}),
      },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch admin inquiry detail: ${res.status}`);
    }

    return await res.json();
  }
);
