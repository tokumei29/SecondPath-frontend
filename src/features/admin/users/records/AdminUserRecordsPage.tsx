import { getAdminUserRecordsServer } from '@/features/admin/users/records/api/getAdminUserRecordsServer';
import { AdminUserRecordsClient } from './AdminUserRecordsClient';

type Props = {
  params: { id: string };
};

export async function AdminUserRecordsPage({ params }: Props) {
  const initialData = await getAdminUserRecordsServer(params.id);
  return <AdminUserRecordsClient userId={params.id} initialData={initialData} />;
}
