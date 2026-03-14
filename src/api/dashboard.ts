import { createClient } from '@/lib/supabase/client';

export const getDashboardData = async () => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  // NEXT_PUBLIC_API_URL は環境に合わせて調整してください
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Dashboardデータの取得に失敗しました');
  }

  return response.json();
};