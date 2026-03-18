import { getTextSupportDetailServer } from '@/features/dashboard/user/textSupport/api/getTextSupportDetailServer';
import { TextSupportDetailPageClient } from '@/features/dashboard/user/textSupport/TextSupportDetailClient';

type Props = {
  params: { id: string };
};

export async function TextSupportDetailPage({ params }: Props) {
  // IDを await で取得
  const { id } = await params;

  // 正しいIDでデータを取得
  const detail = await getTextSupportDetailServer(id);

  return <TextSupportDetailPageClient params={Promise.resolve({ id })} initialDetail={detail} />;
}
