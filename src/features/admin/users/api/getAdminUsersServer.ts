import { cache } from 'react';
import { cookies } from 'next/headers';

export type AdminUserListItem = {
  id: string;
  name?: string | null;
  created_at: string;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getAdminUsersServer = cache(async (): Promise<AdminUserListItem[]> => {
  if (!baseUrl) throw new Error('NEXT_PUBLIC_API_URL is not set');

  const cookieStore = await cookies();
  const uuid = cookieStore.get('user_uuid')?.value;

  const res = await fetch(`${baseUrl}/admin/users`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(uuid ? { 'X-User-Id': uuid } : {}),
    },
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch admin users: ${res.status}`);
  }

  return await res.json();
});
