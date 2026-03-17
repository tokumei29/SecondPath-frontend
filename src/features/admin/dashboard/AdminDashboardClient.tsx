'use client';

import styles from './AdminDashboardPage.module.css';
import type { AdminInquiryStats } from './api/getAdminInquiryStats';

export function AdminDashboardClient({ stats }: { stats: AdminInquiryStats }) {
  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>管理者ダッシュボード</h1>
        <p className={styles.subtitle}>現在の運用状況をリアルタイムで表示しています。</p>
      </header>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${stats.unresolved > 0 ? styles.alert : ''}`}>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>未対応のテキスト相談</span>
            <span className={styles.statValue}>{`${stats.unresolved} 件`}</span>
          </div>
          <div className={styles.icon}>⚠️</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>本日の新規相談</span>
            <span className={styles.statValue}>{`${stats.today} 件`}</span>
          </div>
          <div className={styles.icon}>📩</div>
        </div>
      </div>

      <section className={styles.welcomeSection}>
        <h3>クイックスタート</h3>
        <p>左メニューの「お問い合わせ確認」から、個別の相談へ回答を行うことができます。</p>
      </section>
    </div>
  );
}
