'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/api/auth';
import { getDiaries } from '@/api/diaries';
import { getProfile } from '@/api/profile';
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
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push('/login'); // 未ログインなら即リダイレクト
          return;
        }

        // 現在のページが /settings の場合は、ガイドを表示する必要がないためスキップ
        if (pathname === '/settings') {
          setShowGuide(false);
          setIsChecking(false);
          return;
        }

        const profileData = await getProfile();
        const diaryRes = await getDiaries();
        const diaryList = diaryRes.data || diaryRes;

        const isProfileEmpty = (data: any) => {
          if (!data) return true;
          const hasName = data.name && data.name.trim() !== '';
          const hasArrayContent = [
            'strengths',
            'weaknesses',
            'likes',
            'hobbies',
            'short_term_goals',
            'long_term_goals',
          ].some((key) => data[key] && Array.isArray(data[key]) && data[key].length > 0);
          return !hasName && !hasArrayContent;
        };

        const profileIsInitial = isProfileEmpty(profileData);
        const hasDiaries = Array.isArray(diaryList) && diaryList.length > 0;

        // 初期状態かつ日記未作成ならガイドを表示
        if (profileIsInitial && !hasDiaries) {
          setShowGuide(true);
        }
      } catch (e) {
        console.error('Status check failed', e);
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
