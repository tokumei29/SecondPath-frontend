'use client';

import styles from './layout.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className={styles.container}>
      {/* 左カラム：固定メニュー */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>SecondPath</div>
        <nav className={styles.nav}>
          <Link
            href="/home"
            className={`${styles.navItem} ${pathname === '/home' ? styles.active : ''}`}
          >
            🏠 ダッシュボード
          </Link>
          <Link
            href="/diaries"
            className={`${styles.navItem} ${pathname === '/diaries' ? styles.active : ''}`}
          >
            📝 日報を書く
          </Link>
          <Link href="/community" className={styles.navItem}>
            🌍 匿名の広場
          </Link>
          <Link href="/settings" className={styles.navItem}>
            ⚙️ 設定
          </Link>
        </nav>
      </aside>

      {/* 右側：コンテンツエリア */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default UserLayout;
