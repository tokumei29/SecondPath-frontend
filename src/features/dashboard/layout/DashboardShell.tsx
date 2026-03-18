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
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null); // null: unknown
  const pathname = usePathname();
  const router = useRouter();

  useBodyScrollLock(showGuide);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // 1. 初回に一度だけセッションを取得し、その後は auth state を購読
    let mounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setIsAuthed(!!data.session?.user);
      } catch (e) {
        console.error('Failed to read session', e);
        if (!mounted) return;
        setIsAuthed(false);
      }
    })();

    // 2. 認証状態の変化を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setIsAuthed(!!session?.user);

      // ユーザーが切り替わったら、古いキャッシュやStateを捨てるためにリロード
      // これで「Aのアカウントの画面でBのデータを送る」隙をなくす
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') router.refresh();
    });

    // クリーンアップ
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  // ルート遷移時、未ログインなら /login へ飛ばす
  useEffect(() => {
    if (pathname === '/login') return;
    if (isAuthed === false) {
      router.replace('/login');
    }
  }, [isAuthed, pathname, router]);

  // 初期ロードおよびログイン状態が確定するまでスピナー表示
  useEffect(() => {
    if (pathname === '/login') {
      setIsChecking(false);
      return;
    }
    if (isAuthed === null) {
      setIsChecking(true);
      return;
    }
    // 未ログインは redirect させるのでスピナー継続（瞬間的な画面露出を避ける）
    if (isAuthed === false) {
      setIsChecking(true);
      return;
    }
    // ログイン済み
    setIsChecking(false);
  }, [isAuthed, pathname]);

  // Welcome guide 用にプロフィールをチェック（ログイン済み時のみ）
  const hasCheckedGuideRef = useRef(false);
  useEffect(() => {
    if (pathname === '/login') return;
    if (isAuthed !== true) return;
    if (pathname === '/settings') return;
    if (hasCheckedGuideRef.current) return;

    const run = async () => {
      try {
        const profileData = await getProfile();
        if (profileData?.has_seen_guide) return;
        if (!profileData?.name || profileData.name.trim() === '') {
          setShowGuide(true);
        }
      } catch (e) {
        console.error('Status check failed', e);
      } finally {
        hasCheckedGuideRef.current = true;
      }
    };

    run();
  }, [isAuthed, pathname]);

  useEffect(() => {
    // ログインユーザーが変わったら guide 判定をやり直す
    hasCheckedGuideRef.current = false;
  }, [isAuthed]);

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
  if (isChecking) return <RouteLoading />;

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
      <WelcomeGuideModal isOpen={showGuide} onClose={handleCloseGuide} />
    </div>
  );
}
