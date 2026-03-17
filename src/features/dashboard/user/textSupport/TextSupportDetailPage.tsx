import { getTextSupportDetailServer } from '@/features/dashboard/user/textSupport/api/getTextSupportDetailServer';
import { TextSupportDetailPageClient } from '@/features/dashboard/user/textSupport/TextSupportDetailClient';

type Props = {
  params: { id: string };
};

export async function TextSupportDetailPage({ params }: Props) {
  const detail = await getTextSupportDetailServer(params.id);
  return <TextSupportDetailPageClient params={Promise.resolve(params)} initialDetail={detail} />;
}
