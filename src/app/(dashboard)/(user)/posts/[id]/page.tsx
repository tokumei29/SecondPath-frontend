'use client';

import { use, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getPublicPost } from '@/api/posts';
import styles from './page.module.css';

const PostDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const numericId = id ? Number(id) : undefined;
      if (!numericId || Number.isNaN(numericId)) {
        setIsError(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setIsError(false);
      try {
        const res = await getPublicPost(numericId);
        setPost(res?.data || res || null);
      } catch (e) {
        console.error(e);
        setIsError(true);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

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
