'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './layout.module.css';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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

  if (!isVerified) return null;

  return (
    <div className={styles.adminWrapper}>
      {/* 固定サイドバー */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>SecondPath Admin</div>
        <nav className={styles.nav}>
          <Link href="/adminDashboard/inquiry" className={styles.navItemActive}>
            💬 お問い合わせ確認
          </Link>
        </nav>
        <button
          className={styles.logoutBtn}
          onClick={() => {
            localStorage.removeItem('admin_session');
            router.push('/adminLogin');
          }}
        >
          ログアウト
        </button>
      </aside>

      {/* 右側のコンテンツエリア */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
