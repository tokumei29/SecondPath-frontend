import useSWR, { useSWRConfig } from 'swr';
import {
  getAdminPosts,
  getPublicPosts,
  getPublicPost,
  createAdminPost,
  deleteAdminPost,
  Post,
} from '@/api/posts';

// ==========================================
// 1. 閲覧用フック (Query: GET担当)
// ==========================================

/** 【一般ユーザー用】公開記事一覧 */
export const usePosts = () => {
  const { data, error, isLoading } = useSWR('/posts', getPublicPosts);
  return {
    posts: data?.data || data || [],
    isLoading,
    isError: error,
  };
};

/** 【一般ユーザー用】記事詳細 */
export const usePost = (id?: string | number) => {
  const numericId = id ? Number(id) : undefined;
  const { data, error, isLoading } = useSWR(numericId ? `/posts/${numericId}` : null, () =>
    getPublicPost(numericId!)
  );
  return {
    post: data?.data || data,
    isLoading,
    isError: error,
  };
};

/** 【管理者用】管理記事一覧 */
export const useAdminPosts = () => {
  const { data, error, isLoading, mutate } = useSWR('/admin/posts', getAdminPosts);
  return {
    posts: data?.data || data || [],
    isLoading,
    isError: error,
    mutate,
  };
};

// ==========================================
// 2. 操作用フック (Command: POST/DELETE担当)
// ==========================================

/** 【管理者用】記事の作成・削除アクション */
export const usePostActions = () => {
  const { mutate: globalMutate } = useSWRConfig();

  // 記事の投稿
  const create = async (postData: Post) => {
    const result = await createAdminPost(postData);
    // 関連するキャッシュをすべて更新
    await globalMutate('/admin/posts');
    await globalMutate('/posts');
    return result;
  };

  // 記事の削除
  const remove = async (id: number) => {
    await deleteAdminPost(id);
    // 関連するキャッシュをすべて更新
    await globalMutate('/admin/posts');
    await globalMutate('/posts');
    await globalMutate(`/posts/${id}`, null, false);
  };

  return { create, remove };
};
