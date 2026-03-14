import { createClient } from '@/lib/supabase/client';
import apiClient from './client';

export const getDashboardData = async () => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const response = await apiClient.get('/dashboard', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.data;
};