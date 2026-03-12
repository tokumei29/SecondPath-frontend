'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/api/client';
import { getTextSupports } from '@/api/textSupport';
import styles from './page.module.css';

type TextSupport = {
  id: number;
  subject: string;
  message: string;
  status: 'waiting' | 'replied'; // Railsのenumと連動
  created_at: string;
};

const TextSupportListPage = () => {
  const [supports, setSupports] = useState<TextSupport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupports = async () => {
      try {
        const data = await getTextSupports(); // 定義した関数を呼ぶ
        setSupports(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSupports();
  }, []);

  if (loading) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>相談履歴・回答確認</h1>
        <p className={styles.subtitle}>カウンセラーからの回答はこちらから確認できます</p>
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
          supports.map((support) => (
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

                  {/* ステータスに応じたバッジ表示 */}
                  {support.status === 'replied' ? (
                    <span className={`${styles.badge} ${styles.replied}`}>
                      回答が返ってきています
                    </span>
                  ) : (
                    <span className={`${styles.badge} ${styles.waiting}`}>回答待ち</span>
                  )}
                </div>
                {/* 件名の表示 */}
                <h3 className={styles.subjectTitle}>件名：{support.subject || '無題の相談'}</h3>

                {/* 本文のプレビュー（messageを表示） */}
                <p className={styles.textPreview}>内容：{support.message}</p>
              </div>
              <div className={styles.arrowIcon}>&rarr;</div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default TextSupportListPage;
