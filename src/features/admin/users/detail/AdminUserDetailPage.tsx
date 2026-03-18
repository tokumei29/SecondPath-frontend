// src/app/adminDashboard/users/[id]/page.tsx

export const dynamic = 'force-dynamic'; // Cookieを使うので必須

import { getAdminUserActivityServer } from '@/features/admin/users/detail/api/getAdminUserActivityServer';
import { AdminUserDetailClient } from './AdminUserDetailClient';

type Props = {
  params: Promise<{ id: string }>; // Promise型にする
};

export async function AdminUserDetailPage({ params }: Props) {
  // await で展開してから使う
  const { id } = await params;

  const data = await getAdminUserActivityServer(id);

  return <AdminUserDetailClient data={data} />;
}
