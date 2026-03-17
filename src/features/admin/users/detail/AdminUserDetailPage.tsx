import { getAdminUserActivityServer } from '@/features/admin/users/detail/api/getAdminUserActivityServer';
import { AdminUserDetailClient } from './AdminUserDetailClient';

type Props = {
  params: { id: string };
};

export async function AdminUserDetailPage({ params }: Props) {
  const data = await getAdminUserActivityServer(params.id);
  return <AdminUserDetailClient data={data} />;
}
