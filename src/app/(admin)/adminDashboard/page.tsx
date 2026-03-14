'use client';

import { useEffect, useState } from 'react';
import { getInquiryStats } from '@/api/textSupport';
import styles from './page.module.css';

const AdminDashboardMain = () => {
  const [stats, setStats] = useState({ unresolved: 0, today: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getInquiryStats();
        setStats(data);
      } catch (err) {
        console.error('統計の取得に失敗しました', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
            <span className={styles.statValue}>{loading ? '...' : `${stats.unresolved} 件`}</span>
          </div>
          <div className={styles.icon}>⚠️</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>本日の新規相談</span>
            <span className={styles.statValue}>{loading ? '...' : `${stats.today} 件`}</span>
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
};

export default AdminDashboardMain;
