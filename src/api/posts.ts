import apiClient from './client';

/**
 * 記事データの型定義
 */
export type Post = {
  id?: number;
  title: string;
  content: string; // Markdownテキスト
  created_at?: string;
  updated_at?: string;
};

/**
 * 管理者：支援記事を新規作成（投稿）する
 * POST /api/v1/admin/posts
 */
export const createAdminPost = async (post: Post) => {
  const response = await apiClient.post('/admin/posts', {
    post,
  });
  return response.data;
};

/**
 * 管理者：投稿済みの記事一覧を取得する（管理用）
 * GET /api/v1/admin/posts
 */
export const getAdminPosts = async () => {
  const response = await apiClient.get('/admin/posts');
  return response.data;
};

/**
 * 管理者：特定の記事を削除する
 * DELETE /api/v1/admin/posts/:id
 */
export const deleteAdminPost = async (id: number) => {
  const response = await apiClient.delete(`/admin/posts/${id}`);
  return response.data;
};

/**
 * 一般ユーザー：公開されている記事一覧を取得する
 * GET /api/v1/posts
 */
export const getPublicPosts = async () => {
  const response = await apiClient.get('/posts');
  return response.data;
};

/**
 * 一般ユーザー：特定の記事詳細を取得する
 * GET /api/v1/posts/:id
 */
export const getPublicPost = async (id: number) => {
  const response = await apiClient.get(`/posts/${id}`);
  return response.data;
};
