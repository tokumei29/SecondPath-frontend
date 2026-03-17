import { AdminMemosPageClient } from './AdminMemosPageClient';
import { getAdminMemosServer } from './api/getAdminMemosServer';

export async function AdminMemosPage() {
  const initialMemos = await getAdminMemosServer();
  return <AdminMemosPageClient initialMemos={initialMemos} />;
}
