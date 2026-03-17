import { getPublicPostsServer } from '@/features/dashboard/user/posts/api/getPublicPostsServer';
import { PostsIndexPageClient } from '@/features/dashboard/user/posts/PostsIndexPageClient';

export async function PostsIndexPage() {
  const posts = await getPublicPostsServer();
  return <PostsIndexPageClient initialPosts={posts} />;
}
