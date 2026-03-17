import { getAdminInquiryDetail } from './api/getAdminInquiryDetail';
import { AdminInquiryDetailClient } from './components/AdminInquiryDetailClient';

export async function AdminInquiryDetailPage({ id }: { id: string }) {
  const initialData = await getAdminInquiryDetail(id);
  return <AdminInquiryDetailClient id={id} initialData={initialData} />;
}
