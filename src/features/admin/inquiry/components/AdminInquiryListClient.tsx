'use client';

import Link from 'next/link';
import { formatJapanLocaleDateTime } from '@/lib/utils';
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
        {safeSupports.map((s) => {
          const withdrawn = Boolean(s.user_account_withdrawn_at);
          return (
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

              <div
                className={`${styles.userSection} ${withdrawn ? styles.userSectionWithdrawn : ''}`}
              >
                <div className={styles.infoRow}>
                  <span className={styles.label}>UUID:</span>
                  <code className={styles.uuidText}>{s.user_id}</code>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>お名前 / メールアドレス:</span>
                  <div className={styles.userDetails}>
                    <div className={styles.nameRow}>
                      <span className={styles.userName}>{s.name || '匿名希望'}</span>
                      {withdrawn && (
                        <span
                          className={styles.withdrawnBadge}
                          title={
                            s.user_account_withdrawn_at
                              ? `退会日時: ${formatJapanLocaleDateTime(s.user_account_withdrawn_at)}`
                              : '退会済み'
                          }
                        >
                          <span className={styles.withdrawnBadgeIcon} aria-hidden>
                            🚪
                          </span>
                          退会済み
                        </span>
                      )}
                    </div>
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
          );
        })}
      </div>
    </div>
  );
}
