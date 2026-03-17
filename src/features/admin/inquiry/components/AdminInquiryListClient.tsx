'use client';

import Link from 'next/link';
import styles from './AdminInquiryList.module.css';
import type { AdminTextSupportListItem } from '../api/getAdminTextSupports';

export function AdminInquiryListClient({ supports }: { supports: AdminTextSupportListItem[] }) {
  const safeSupports = Array.isArray(supports) ? supports : [];

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>お問い合わせ一覧</h1>
        <p>ユーザー情報を確認し、トークルームで回答してください</p>
      </header>

      <div className={styles.grid}>
        {safeSupports.map((s) => (
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
