import useSWR, { useSWRConfig } from 'swr';
import {
  getAdminPosts,
  getPublicPosts,
  getPublicPost,
  createAdminPost,
  deleteAdminPost,
  Post,
} from '@/api/posts';

// --- 一般ユーザー用：公開記事一覧 ---
export const usePosts = () => {
  const { data, error, isLoading } = useSWR('/posts', getPublicPosts);

  return {
    posts: data?.data || data || [], // Railsのレスポンス形式に柔軟に対応
    isLoading,
    isError: error,
  };
};

// --- 一般ユーザー用：記事詳細 ---
export const usePost = (id?: string | number) => {
  const numericId = id ? Number(id) : undefined;

  const { data, error, isLoading } = useSWR(numericId ? `/posts/${numericId}` : null, () =>
    getPublicPost(numericId!)
  );

  return {
    post: data?.data || data, // Railsの { status: 'success', data: {...} } 対応
    isLoading,
    isError: error,
  };
};

// --- 管理者用：記事管理（作成・一覧・削除） ---
export const useAdminPosts = () => {
  const { mutate: globalMutate } = useSWRConfig();
  const { data, error, mutate, isLoading } = useSWR('/admin/posts', getAdminPosts);

  // 記事の投稿
  const create = async (postData: Post) => {
    const result = await createAdminPost(postData);
    await mutate(); // 管理者用一覧を更新
    globalMutate('/posts'); // 一般公開側のキャッシュも古くなるので更新を促す
    return result;
  };

  // 記事の削除
  const remove = async (id: number) => {
    await deleteAdminPost(id);
    await mutate(); // 管理者用一覧を更新
    globalMutate('/posts'); // 一般公開側も更新
  };

  return {
    posts: data?.data || data || [],
    isLoading,
    isError: error,
    create,
    remove,
    mutate,
  };
};
