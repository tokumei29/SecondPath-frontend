'use client';

import { use, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './PostDetailPage.module.css';

type Props = {
  params: Promise<{ id: string }>;
  initialPost: any | null;
};

export function PostDetailPageClient({ params, initialPost }: Props) {
  const { id } = use(params);

  const [post] = useState<any>(initialPost);
  if (!initialPost) {
    return <div className={styles.error}>記事が見つかりませんでした。 (ID: {id})</div>;
  }

  return (
    <div className={styles.container}>
      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <div>
            {post.created_at && (
              <span className={styles.date}>
                公開日: {new Date(post.created_at).toLocaleDateString('ja-JP')}
              </span>
            )}
          </div>
        </header>

        <div className={styles.content}>
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
}
