import { PostDetailPage } from '@/features/dashboard/user/posts/PostDetailPage';

export default function PostDetailRoute({ params }: { params: { id: string } }) {
  return <PostDetailPage params={params} />;
}
