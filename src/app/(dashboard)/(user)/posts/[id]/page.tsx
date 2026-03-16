'use client';

import { use } from 'react';
import ReactMarkdown from 'react-markdown';
import { usePost } from '@/services/usePosts';
import styles from './page.module.css';

const PostDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  // SWRフックを使用（内部で number に変換される）
  const { post, isLoading, isError } = usePost(id);

  if (isLoading) return <div className={styles.loading}>記事を読み込み中...</div>;
  if (isError || !post) return <div className={styles.error}>記事が見つかりませんでした。</div>;

  return (
    <div className={styles.container}>
      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            {post.created_at && (
              <span className={styles.date}>
                公開日: {new Date(post.created_at).toLocaleDateString('ja-JP')}
              </span>
            )}
          </div>
        </header>

        <div className={styles.content}>
          {/* contentが空でないことを確認してレンダリング */}
          <ReactMarkdown>{post.content || ''}</ReactMarkdown>
        </div>

        <footer className={styles.footer}>
          <button type="button" onClick={() => window.history.back()} className={styles.backButton}>
            ← 記事一覧に戻る
          </button>
        </footer>
      </article>
    </div>
  );
};

export default PostDetailPage;
