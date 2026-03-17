import { AdminUserRecordsPage } from '@/features/admin/users/records/AdminUserRecordsPage';

export default function AdminUserRecordsRoute({ params }: { params: { id: string } }) {
  return <AdminUserRecordsPage params={params} />;
}
