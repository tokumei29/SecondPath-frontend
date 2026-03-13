'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import apiClient from '@/api/client'; // 既存のclientを使用
import styles from './page.module.css';

type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

const PostDetailPage = () => {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // 先ほど作成した Api::V1::PostsController#show を叩く
        const response = await apiClient.get(`/posts/${params.id}`);
        setPost(response.data);
      } catch (error) {
        console.error('記事の取得に失敗しました', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) fetchPost();
  }, [params.id]);

  if (isLoading) return <div className={styles.loading}>記事を読み込み中...</div>;
  if (!post) return <div className={styles.error}>記事が見つかりませんでした。</div>;

  return (
    <div className={styles.container}>
      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
        </header>

        {/* Markdownの解析と表示 */}
        <div className={styles.content}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
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
