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
    // 【重要】ログインページでは全てのチェックをスキップ（無限ループの絶対回避）
    if (pathname === '/login') {
      setIsChecking(false);
      return;
    }

    const checkUserStatus = async () => {
      const storageKey = Object.keys(localStorage).find(
        (key) => key.startsWith('sb-') && key.endsWith('-auth-token')
      );

      if (!storageKey) {
        localStorage.clear();
        router.replace('/login');
        return;
      }

      try {
        // 1. ユーザー確認
        const user = await getCurrentUser();
        if (!user) {
          router.replace('/login');
          return;
        }

        // 2. 元の仕様：/settings の場合はガイドを表示せず終了
        if (pathname === '/settings') {
          setShowGuide(false);
          setIsChecking(false);
          return;
        }

        // 3. 元の仕様（profileIsInitial && !hasDiaries）を
        // Rails側で判定した結果「show_guide」として受け取る
        const data = await getDashboardData();
        
        if (data.show_guide) {
          setShowGuide(true);
        }

      } catch (e) {
        console.error('Status check failed', e);
        // 通信エラー時はループを防ぐため何もしないか、ログインへ
      } finally {
        setIsChecking(false);
      }
    };

    checkUserStatus();
  }, [pathname, router]);

  // ログインページの場合は、サイドバーなしでコンテンツだけ出す
  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (isChecking) {
    return <div className={styles.loading}>loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
      {/* 元の仕様：settings以外、かつ判定trueなら表示 */}
      {pathname !== '/settings' && <WelcomeGuideModal isOpen={showGuide} />}
    </div>
  );
};

export default UserLayout;