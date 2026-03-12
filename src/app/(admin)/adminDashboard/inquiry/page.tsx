'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllTextSupports } from '@/api/textSupport';
import styles from './page.module.css';

export default function AdminDashboardPage() {
  const [supports, setSupports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getAllTextSupports();
        setSupports(res.data || []);
      } catch (err) {
        console.error('データ取得失敗:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>お問い合わせ一覧</h1>
        <p>ユーザー情報を確認し、トークルームで回答してください</p>
      </header>

      <div className={styles.grid}>
        {supports.map((s) => (
          <Link href={`/adminDashboard/${s.id}`} key={s.id} className={styles.cardLink}>
            <div
              className={`${styles.card} ${s.status === 'waiting' ? styles.unread : styles.read}`}
            >
              <div className={styles.cardHeader}>
                <span className={styles.statusTag}>
                  {s.status === 'waiting' ? '● 未対応' : '✓ 対応済み'}
                </span>
                <span className={styles.date}>{new Date(s.created_at).toLocaleString()}</span>
              </div>

              {/* ユーザー特定セクション */}
              <div className={styles.userSection}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>UUID:</span>
                  <code className={styles.uuidText}>{s.user_id}</code>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>お名前 / メールアドレス:</span>
                  <div className={styles.userDetails}>
                    <span className={styles.userName}>{s.name || '匿名希望'}</span>
                    <span className={styles.userEmail}>{s.email || 'メールなし'}</span>
                  </div>
                </div>
              </div>

              {/* 内容セクション */}
              <div className={styles.contentSection}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>件名:</span>
                  <span className={styles.subjectText}>{s.subject || '無題'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>内容:</span>
                  <p className={styles.messageText}>{s.message || '内容がありません'}</p>
                </div>
              </div>

              <div className={styles.cardFooter}>トークルームを開く ➔</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
