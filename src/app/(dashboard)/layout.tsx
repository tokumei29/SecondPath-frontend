'use client';

import React from 'react';
import styles from './layout.module.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type UserLayoutProps = {
  children: React.ReactNode;
};

const UserLayout = ({ children }: UserLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const confirmLogout = window.confirm('ログアウトしますか？');
    if (!confirmLogout) return;

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // ログアウト成功後、ログイン画面へ
      router.push('/login');
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`ログアウトに失敗しました: ${error.message}`);
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* 左カラム：固定メニュー */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>SecondPath</div>

        <nav className={styles.nav}>
          <div className={styles.navGroup}>
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
            <Link
              href="/community"
              className={`${styles.navItem} ${pathname === '/community' ? styles.active : ''}`}
            >
              🌍 匿名の広場
            </Link>
            <Link
              href="/settings"
              className={`${styles.navItem} ${pathname === '/settings' ? styles.active : ''}`}
            >
              ⚙️ 設定
            </Link>
          </div>

          {/* ログアウトボタンを最下部に配置 */}
          <button type="button" onClick={handleLogout} className={styles.logoutButton}>
            🚪 ログアウト
          </button>
        </nav>
      </aside>

      {/* 右側：コンテンツエリア */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default UserLayout;
