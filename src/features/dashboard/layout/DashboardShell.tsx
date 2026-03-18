'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/api/auth';
import { RouteLoading } from '@/components/appRouter/RouteLoading';
import { getProfile, updateProfile } from '@/features/dashboard/user/settings/api/profileClient';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { Sidebar } from './components/sidebar/Sidebar';
import { WelcomeGuideModal } from './components/welcome/WelcomeGuideModal';
import styles from './DashboardShell.module.css';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [showGuide, setShowGuide] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null); // null: unknown
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isRoutePending, setIsRoutePending] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useBodyScrollLock(showGuide);

  // NOTE: 認証状態は api/auth.ts の supabase と統一する

  const isValidSession = (session: any) => {
    // セッションの有効期限は見ず、「ユーザーとアクセストークンが存在するか」だけで判定する
    return !!session?.user && !!session?.access_token;
  };

  // クライアント側でのマウント完了までは常にローディングを出す
  useLayoutEffect(() => {
    setHasHydrated(true);
  }, []);

  // クライアント遷移（Linkクリック）中もスピナーを回す
  useEffect(() => {
    setIsRoutePending(false);
  }, [pathname]);

  const handleClickCapture = (e: React.MouseEvent) => {
    if (isChecking) return;
    if (isRoutePending) return;

    const target = e.target as Element | null;
    const anchor = target?.closest?.('a') as HTMLAnchorElement | null;
    if (!anchor) return;

    // 修飾キーや新規タブは除外
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (anchor.target && anchor.target !== '_self') return;
    if (anchor.hasAttribute('download')) return;

    const href = anchor.getAttribute('href');
    if (!href) return;
    if (href.startsWith('#')) return;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return;

    try {
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search)
        return;
      setIsRoutePending(true);
    } catch {
      // ignore invalid URLs
    }
  };

  useEffect(() => {
    // 1. 初回に一度だけセッションを取得し、その後は auth state を購読
    let mounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setIsAuthed(isValidSession(data.session));
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
      setIsAuthed(isValidSession(session));

      // ユーザーが切り替わったら、古いキャッシュやStateを捨てるためにリロード
      // これで「Aのアカウントの画面でBのデータを送る」隙をなくす
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') router.refresh();
    });

    // クリーンアップ
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

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
  if (!hasHydrated || isChecking || isRoutePending) return <RouteLoading />;

  return (
    <div className={styles.container} onClickCapture={handleClickCapture}>
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
      <WelcomeGuideModal isOpen={showGuide} onClose={handleCloseGuide} />
    </div>
  );
}
