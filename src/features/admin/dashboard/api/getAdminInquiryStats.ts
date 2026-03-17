import { cache } from 'react';
import { cookies } from 'next/headers';

export type AdminInquiryStats = {
  unresolved: number;
  today: number;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getAdminInquiryStats = cache(async (): Promise<AdminInquiryStats> => {
  if (!baseUrl) throw new Error('NEXT_PUBLIC_API_URL is not set');

  const cookieStore = await cookies();
  const uuid = cookieStore.get('user_uuid')?.value;

  const res = await fetch(`${baseUrl}/admin/text_supports/stats`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(uuid ? { 'X-User-Id': uuid } : {}),
    },
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch inquiry stats: ${res.status}`);
  }

  return await res.json();
});
