'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from './layout.module.css';

type UserLayoutProps = {
  children: React.ReactNode;
};

const UserLayout = ({ children }: UserLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const userId = params?.userId as string;

  const handleLogout = async () => {
    const confirmLogout = window.confirm('ログアウトしますか？');
    if (!confirmLogout) return;

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      router.push('/login');
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`ログアウトに失敗しました: ${error.message}`);
      }
    }
  };

  const getDynamicPath = (path: string) => `/${userId}${path}`;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>SecondPath</div>

        <nav className={styles.nav}>
          {/* メインメニュー */}
          <div className={styles.navGroup}>
            <Link
              href={getDynamicPath('/home')}
              className={`${styles.navItem} ${pathname.includes('/home') ? styles.active : ''}`}
            >
              🏠 ダッシュボード
            </Link>
            <Link
              href={getDynamicPath('/settings')}
              className={`${styles.navItem} ${pathname.includes('/settings') ? styles.active : ''}`}
            >
              ⚙️ 自己分析設定
            </Link>
            <Link
              href={getDynamicPath('/diaries')}
              className={`${styles.navItem} ${pathname.endsWith('/diaries') ? styles.active : ''}`}
            >
              📝 日報を書く
            </Link>
            <Link
              href={getDynamicPath('/diaries/history')}
              className={`${styles.navItem} ${pathname.includes('/diaries/history') ? styles.active : ''}`}
            >
              📚 過去の日報記録
            </Link>
          </div>

          {/* 追加：アセスメント（心理鑑定）グループ */}
          <div className={styles.navGroup}>
            <div className={styles.navLabel}>アセスメント</div>
            <Link
              href={getDynamicPath('/assessments')}
              className={`${styles.navItem} ${pathname.endsWith('/assessments') ? styles.active : ''}`}
            >
              📊 PHQ-9セルフチェック
            </Link>
            <Link
              href={getDynamicPath('/assessments/history')}
              className={`${styles.navItem} ${pathname.includes('/assessments/history') ? styles.active : ''}`}
            >
              📈 PHQ-9回復の軌跡
            </Link>
          </div>

          {/* その他 */}
          <div className={styles.navGroup}>
            <Link
              href={getDynamicPath('/community')}
              className={`${styles.navItem} ${pathname.includes('/community') ? styles.active : ''}`}
            >
              🌍 匿名の広場
            </Link>
          </div>

          <button type="button" onClick={handleLogout} className={styles.logoutButton}>
            🚪 ログアウト
          </button>
        </nav>
      </aside>

      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default UserLayout;
