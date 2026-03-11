'use client';

import styles from './page.module.css';

const DashboardPage = () => {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>ダッシュボード</h1>
        <p className={styles.subtitle}>おかえりなさい。今日のあなたの積み上げを確認しましょう。</p>
      </header>

      <div className={styles.dashboardGrid}>
        {/* 右側に並べたいカード群 */}
        <section className={styles.card}>
          <h3>継続日数</h3>
          <p className={styles.stat}>12日</p>
        </section>

        <section className={styles.card}>
          <h3>最近の記録</h3>
          <p>ここに最新の3件くらいを表示させる...</p>
        </section>
      </div>
    </>
  );
};

export default DashboardPage;
