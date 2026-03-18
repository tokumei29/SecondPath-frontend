import { getPublicPostServer } from '@/features/dashboard/user/posts/api/getPublicPostServer';
import { PostDetailPageClient } from '@/features/dashboard/user/posts/PostDetailPageClient';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailRoute({ params }: Props) {
  // 1. params を await して ID を取得
  const { id } = await params;
  const numericId = Number(id);

  // 2. サーバー側でデータを取得
  let post = null;
  if (numericId && !Number.isNaN(numericId)) {
    post = await getPublicPostServer(numericId);
  }

  // 3. Client Component に params と initialPost の両方を渡す
  return <PostDetailPageClient params={params} initialPost={post} />;
}
