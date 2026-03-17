import { AdminInquiryDetailPage } from '@/features/admin/inquiryDetail/AdminInquiryDetailPage';

export default async function AdminInquiryDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminInquiryDetailPage id={id} />;
}
