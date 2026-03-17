import { getPublicPostServer } from '@/features/dashboard/user/posts/api/getPublicPostServer';
import { PostDetailPageClient } from '@/features/dashboard/user/posts/PostDetailPageClient';

type Props = {
  params: { id: string };
};

export async function PostDetailPage({ params }: Props) {
  const numericId = Number(params.id);
  if (!numericId || Number.isNaN(numericId)) {
    return <PostDetailPageClient params={Promise.resolve(params)} initialPost={null} />;
  }
  const post = await getPublicPostServer(numericId);
  return <PostDetailPageClient params={Promise.resolve(params)} initialPost={post} />;
}
