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
  updated_at: string;
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

  // 既読判定ロジック
  const checkIsRead = (support: TextSupport) => {
    // 1. カウンセラーの回答がない（statusがwaiting）なら、未読バッジを出す必要すらない
    if (support.status !== 'replied') return false;

    const lastRead = localStorage.getItem(`read_support_${support.id}`);
    if (!lastRead) return false; // 一度も読んでいないなら未読

    const lastReadDate = new Date(lastRead);

    // 2. 比較対象は「相談全体の最終更新日(updated_at)」
    // カウンセラーが返信した時にRailsでtouch: trueしていれば、これが最新の返信時刻になる
    const latestActivityDate = new Date(support.updated_at);

    // 3. 【ここが修正ポイント】
    // 「最後に読んだ時間」が「最新の更新時間」を追い越している時だけが既読
    // 1秒でも updated_at が新しければ、それは「未読（新着）」
    return lastReadDate.getTime() > latestActivityDate.getTime();
  };

  if (loading) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>相談履歴・回答確認</h1>
        <p className={styles.subtitle}>
          カウンセラーからの回答はこちらから確認できます。フォームで相談した内容ごとに会話が展開されます。
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
          supports.map((support) => {
            const isRead = checkIsRead(support); // ここで判定

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

                    {/* バッジの出し分け */}
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
