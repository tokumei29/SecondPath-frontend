'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTextSupports } from '@/api/textSupport';
import styles from './page.module.css';

const TextSupportListPage = () => {
  const [supports, setSupports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 既読判定（services/useTextSupport と同等）
  const checkIsRead = (support: any) => {
    if (support.status !== 'replied') return false;
    const lastRead = localStorage.getItem(`read_support_${support.id}`);
    if (!lastRead) return false;
    return new Date(lastRead).getTime() > new Date(support.updated_at).getTime();
  };

  useEffect(() => {
    const fetchSupports = async () => {
      setIsLoading(true);
      try {
        const res = await getTextSupports();
        setSupports(res?.data || res || []);
      } catch (e) {
        console.error(e);
        setSupports([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupports();
  }, []);

  // デザイン維持のため isLoading の表示
  if (isLoading) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>相談履歴・回答確認</h1>
        <p className={styles.subtitle}>
          カウンセラーからの回答はこちらから確認できます。フォームで相談した内容ごとにチャット形式で会話が展開されます。
        </p>
      </header>

      <div className={styles.cardList}>
        {supports.length === 0 ? (
          <div className={styles.emptyState}>
            <p>まだ相談履歴はありません。</p>
            <Link href="/textSupport/new" className={styles.newButton}>
              新しく相談する
            </Link>
          </div>
        ) : (
          supports.map((support: any) => {
            const isRead = checkIsRead(support); // フックの関数で判定

            return (
              <Link href={`/textSupport/${support.id}`} key={support.id} className={styles.card}>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <span className={styles.date}>
                      {new Date(support.created_at).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {/* バッジの出し分け（ロジック維持） */}
                    {support.status === 'replied' ? (
                      isRead ? (
                        <span className={`${styles.badge} ${styles.read}`}>回答を確認済み</span>
                      ) : (
                        <span className={`${styles.badge} ${styles.replied}`}>新着の回答あり</span>
                      )
                    ) : (
                      <span className={`${styles.badge} ${styles.waiting}`}>回答待ち</span>
                    )}
                  </div>
                  <h3 className={styles.subjectTitle}>件名：{support.subject || '無題の相談'}</h3>
                  <p className={styles.textPreview}>内容：{support.message}</p>
                </div>
                <div className={styles.arrowIcon}>&rarr;</div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TextSupportListPage;
