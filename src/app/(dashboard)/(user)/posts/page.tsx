'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPublicPosts } from '@/api/posts';
import styles from './page.module.css';

const PostsIndexPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await getPublicPosts();
        setPosts(res?.data || res || []);
      } catch (e) {
        console.error(e);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (isLoading) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>支援記事・ナレッジ</h1>
        <p className={styles.subtitle}>
          再出発のための知恵や、心のケアに関する情報をまとめています。
        </p>
      </header>

      <div className={styles.grid}>
        {posts && posts.length > 0 ? (
          posts.map((post: any) => (
            <Link href={`/posts/${post.id}`} prefetch={false} key={post.id} className={styles.card}>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <div className={styles.postFooter}>
                <span className={styles.more}>続きを読む →</span>
              </div>
            </Link>
          ))
        ) : (
          <p className={styles.empty}>現在、公開されている記事はありません。</p>
        )}
      </div>
    </div>
  );
};

export default PostsIndexPage;
