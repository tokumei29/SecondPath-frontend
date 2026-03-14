'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser } from '@/api/auth';
import { getDashboardData } from '@/api/dashboard';
import { WelcomeGuideModal } from '@/features/components/home/WelcomeGuideModal';
import { Sidebar } from '@/features/components/layout/sidebar';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import styles from './layout.module.css';

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const [showGuide, setShowGuide] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useBodyScrollLock(showGuide);

  useEffect(() => {
    // ログインページ自体ではこのチェックを走らせない（ループ防止）
    if (pathname === '/login') {
      setIsChecking(false);
      return;
    }

    const initializeApp = async () => {
      const storageKey = Object.keys(localStorage).find(
        (key) => key.startsWith('sb-') && key.endsWith('-auth-token')
      );

      // 1. トークンがないなら即ログインへ
      if (!storageKey) {
        localStorage.clear();
        router.replace('/login');
        return;
      }

      try {
        // 2. ユーザー確認
        const user = await getCurrentUser();
        if (!user) {
          router.replace('/login');
          return;
        }

        // 3. /settings 以外なら「まとめ買いAPI」でガイド判定
        if (pathname !== '/settings') {
          const data = await getDashboardData();
          if (data.show_guide) {
            setShowGuide(true);
          }
        }

      } catch (e) {
        console.error('Initialization failed', e);
        // 通信エラー等でも一応ログインへ（または何もしない）
        router.replace('/login');
      } finally {
        setIsChecking(false);
      }
    };

    initializeApp();
  }, [pathname, router]);

  // チェック中は何も出さない（または最小限のローディング）
  if (isChecking && pathname !== '/login') {
    return <div className={styles.loading}>loading...</div>;
  }

  // ログインページならレイアウト（サイドバー等）を表示せずに中身だけ出す
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
      <WelcomeGuideModal isOpen={showGuide} />
    </div>
  );
};

export default UserLayout;