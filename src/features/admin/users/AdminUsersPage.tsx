import { AdminUsersPageClient } from './AdminUsersPageClient';
import { getAdminUsersServer } from './api/getAdminUsersServer';

export async function AdminUsersPage() {
  const initialUsers = await getAdminUsersServer();
  return <AdminUsersPageClient initialUsers={initialUsers} />;
}
