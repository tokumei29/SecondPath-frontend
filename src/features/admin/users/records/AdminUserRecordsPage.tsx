import { getAdminUserRecordsServer } from '@/features/admin/users/records/api/getAdminUserRecordsServer';
import { AdminUserRecordsClient } from './AdminUserRecordsClient';
import { redirect } from 'next/navigation';

type Props = {
  params: { id: string };
};

export async function AdminUserRecordsPage({ params }: Props) {
  // TextSupport の書き方に寄せる（Client 側で use(params) するため）
  const { id } = await params;
  if (!id || id === 'undefined') {
    redirect('/adminDashboard/users');
  }

  const initialData = await getAdminUserRecordsServer(id);
  return <AdminUserRecordsClient params={Promise.resolve({ id })} initialData={initialData} />;
}
