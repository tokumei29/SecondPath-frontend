import { TextSupportDetailPage } from '@/features/dashboard/user/textSupport/TextSupportDetailPage';

export default function TextSupportDetailRoute({ params }: { params: { id: string } }) {
  return <TextSupportDetailPage params={params} />;
}
