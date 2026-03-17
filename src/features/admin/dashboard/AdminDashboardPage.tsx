import { AdminDashboardClient } from './AdminDashboardClient';
import { getAdminInquiryStats } from './api/getAdminInquiryStats';

export async function AdminDashboardPage() {
  const stats = await getAdminInquiryStats();
  return <AdminDashboardClient stats={stats} />;
}
