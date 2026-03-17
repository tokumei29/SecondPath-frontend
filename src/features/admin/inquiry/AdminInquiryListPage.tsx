import { getAdminTextSupports } from './api/getAdminTextSupports';
import { AdminInquiryListClient } from './components/AdminInquiryListClient';

export async function AdminInquiryListPage() {
  const supports = await getAdminTextSupports();
  return <AdminInquiryListClient supports={supports} />;
}
