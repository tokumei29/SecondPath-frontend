import { AdminUserDetailPage } from '@/features/admin/users/detail/AdminUserDetailPage';

export default function AdminUserDetailRoute({ params }: { params: { id: string } }) {
  return <AdminUserDetailPage params={params} />;
}
