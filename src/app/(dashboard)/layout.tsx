'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser } from '@/api/auth';
import { getDashboardData } from '@/api/dashboard'; // ★まとめ買いAPI
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
    const checkUserStatus = async () => {
      // 1. ローカルストレージのセッション確認
      const storageKey = Object.keys(localStorage).find(
        (key) => key.startsWith('sb-') && key.endsWith('-auth-token')
      );

      if (!storageKey) {
        localStorage.clear();
        if (pathname !== '/login') {
          router.replace('/login');
        }
        return;
      }

      try {
        // 2. Railsの認証確認
        const user = await getCurrentUser();
        if (!user) {
          router.push('/login');
          return;
        }

        // 3. /settings ページの場合はガイド判定自体をスキップして終了
        if (pathname === '/settings') {
          setShowGuide(false);
          setIsChecking(false);
          return;
        }

        // 4. ★ここが肝：まとめ買いAPIを1回だけ叩く
        // これ1つで profileData と diaryList の取得・判定をRails側で済ませた結果が返ってくる
        const dashboardData = await getDashboardData();

        // Rails側で計算済みの show_guide フラグをそのまま使用
        // これにより、どのページから入っても初回ならガイドが出る
        if (dashboardData.show_guide) {
          setShowGuide(true);
        }
      } catch (e) {
        console.error('Status check failed', e);
        // エラー（認証切れ等）時はログインへ飛ばすのが安全
        if (pathname !== '/login') router.push('/login');
      } finally {
        setIsChecking(false);
      }
    };

    checkUserStatus();
  }, [pathname, router]);

  if (isChecking) {
    return <div className={styles.loading}>loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
      {/* settingsページ以外、かつ判定がtrueの場合のみ表示 */}
      {pathname !== '/settings' && <WelcomeGuideModal isOpen={showGuide} />}
    </div>
  );
};

export default UserLayout;
