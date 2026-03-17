'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './TextSupportListPage.module.css';

type Props = {
  initialSupports: any[];
};

export function TextSupportListPageClient({ initialSupports }: Props) {
  const [supports] = useState<any[]>(initialSupports ?? []);

  const checkIsRead = (support: any) => {
    if (support.status !== 'replied') return false;
    const lastRead = localStorage.getItem(`read_support_${support.id}`);
    if (!lastRead) return false;
    return new Date(lastRead).getTime() > new Date(support.updated_at).getTime();
  };

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
            const isRead = checkIsRead(support);

            return (
              <Link href={`/textSupport/${support.id}`} key={support.id} className={styles.card}>
                <div>
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
                  <h3>件名：{support.subject || '無題の相談'}</h3>
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
}
