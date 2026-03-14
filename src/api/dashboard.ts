import { createClient } from '@/lib/supabase/client';

export const getDashboardData = async () => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) throw new Error('No session found');

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/dashboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // これで 401 が消えます
    },
  });

  if (!response.ok) throw new Error('Dashboard fetch failed');
  return response.json();
};
