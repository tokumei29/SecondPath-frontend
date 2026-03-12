'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; // usePathnameを追加
import styles from './layout.module.css';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // 現在のパスを取得
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const sessionStr = localStorage.getItem('admin_session');
    if (!sessionStr) {
      router.replace('/adminLogin');
      return;
    }
    const session = JSON.parse(sessionStr);
    if (session.authenticated && Date.now() < session.expiresAt) {
      setIsVerified(true);
    } else {
      router.replace('/adminLogin');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    router.replace('/adminLogin');
  };

  if (!isVerified) return null;

  return (
    <div className={styles.adminWrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>SecondPath Admin</div>

        <nav className={styles.nav}>
          <Link
            href="/adminDashboard"
            className={pathname === '/adminDashboard' ? styles.navItemActive : styles.navItem}
          >
            📊 ダッシュボード
          </Link>
          <Link
            href="/adminDashboard/inquiry"
            className={pathname.includes('/inquiry') ? styles.navItemActive : styles.navItem}
          >
            💬 お問い合わせ確認
          </Link>
          <Link
            href="/adminDashboard/users"
            className={pathname.includes('/users') ? styles.navItemActive : styles.navItem}
          >
            👥 ユーザー一覧確認
          </Link>
        </nav>
      </aside>

      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
