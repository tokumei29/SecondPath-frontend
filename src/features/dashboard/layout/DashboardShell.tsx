'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser } from '@/api/auth';
import { RouteLoading } from '@/components/appRouter/RouteLoading';
import { getProfile, updateProfile } from '@/features/dashboard/user/settings/api/profileClient';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { createClient } from '@/lib/supabase/client';
import { Sidebar } from './components/sidebar/Sidebar';
import { WelcomeGuideModal } from './components/welcome/WelcomeGuideModal';
import styles from './DashboardShell.module.css';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [showGuide, setShowGuide] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isRoutePending, setIsRoutePending] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useBodyScrollLock(showGuide);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // 1. 認証状態の変化を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        // ユーザーが切り替わったら、古いキャッシュやStateを捨てるためにリロード
        // これで「Aのアカウントの画面でBのデータを送る」隙をなくす
        router.refresh();
      }
    });

    // クリーンアップ
    return () => subscription.unsubscribe();
  }, [router, supabase]);

  useEffect(() => {
    if (pathname === '/login') {
      setIsChecking(false);
      return;
    }

    const checkUserStatus = async () => {
      setIsChecking(true);
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.replace('/login');
          return;
        }

        const profileData = await getProfile();

        if (pathname === '/settings' || profileData?.has_seen_guide) {
          return;
        }

        if (!profileData.name || profileData.name.trim() === '') {
          setShowGuide(true);
        } else {
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

  // ルート間遷移時にも、短時間だけローディングスピナを出す
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevPathRef.current === null) {
      prevPathRef.current = pathname;
      return;
    }
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setIsRoutePending(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (!isRoutePending) return;
    const timer = setTimeout(() => {
      setIsRoutePending(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isRoutePending]);

  const handleCloseGuide = async () => {
    setShowGuide(false);
    try {
      // ガイドを閉じたらBEに保存。localStorageは一切使わない。
      await updateProfile({ has_seen_guide: true });
    } catch (e) {
      console.error('Failed to save guide status', e);
    }
  };

  if (pathname === '/login') return <>{children}</>;
  if (isChecking || isRoutePending) return <RouteLoading />;

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
      <WelcomeGuideModal isOpen={showGuide} onClose={handleCloseGuide} />
    </div>
  );
}
