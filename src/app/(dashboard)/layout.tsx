'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'; // 追加
import { getDiaries } from '@/api/diaries';
import { getProfile } from '@/api/profile';
import { WelcomeGuideModal } from '@/features/components/home/WelcomeGuideModal';
import { Sidebar } from '@/features/components/layout/sidebar';
import styles from './layout.module.css';

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const [showGuide, setShowGuide] = useState(false);
  const pathname = usePathname(); // 現在のパスを取得

  useEffect(() => {
    // 現在のページが /settings の場合は、ガイドを表示する必要がないためスキップ
    if (pathname === '/settings') {
      setShowGuide(false);
      return;
    }

    const checkUserStatus = async () => {
      try {
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
      }
    };

    checkUserStatus();
  }, [pathname]); // パスが変わるたびに再判定（設定完了後に戻ってきた時などのため）

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
