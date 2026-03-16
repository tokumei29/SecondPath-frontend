'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser } from '@/api/auth';
import { getProfile } from '@/api/profile'; // getDiaries は削除
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
    if (pathname === '/login') {
      setIsChecking(false);
      return;
    }

    const checkUserStatus = async () => {
      // 1. まずフラグチェック（これがあれば API は一切叩かない）
      const hasSeenGuide = localStorage.getItem('has_seen_welcome_guide');

      try {
        const user = await getCurrentUser();
        if (!user) {
          router.replace('/login');
          return;
        }

        // 2. /settings なら出さない、または既にフラグがあるなら即終了
        if (pathname === '/settings' || hasSeenGuide === 'true') {
          setIsChecking(false);
          return;
        }

        // 3. フラグがない場合のみ、プロフを確認（名前があるかチェック）
        const profileData = await getProfile();

        // 名前が空、またはプロフィール自体が存在しない場合は「未設定」とみなす
        if (!profileData || !profileData.name || profileData.name.trim() === '') {
          setShowGuide(true);
        } else {
          // すでに名前があるなら、もうガイドは不要なのでフラグを立てる
          localStorage.setItem('has_seen_welcome_guide', 'true');
        }
      } catch (e) {
        console.error('Status check failed', e);
      } finally {
        setIsChecking(false);
      }
    };

    checkUserStatus();
  }, [pathname, router]);

  const handleCloseGuide = () => {
    setShowGuide(false);
  };

  if (pathname === '/login') return <>{children}</>;
  if (isChecking) return <div className={styles.loading}>loading...</div>;

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
      <WelcomeGuideModal isOpen={showGuide} onClose={handleCloseGuide} />
    </div>
  );
};

export default UserLayout;
