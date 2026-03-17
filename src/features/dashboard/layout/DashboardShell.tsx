'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser } from '@/api/auth';
import { getProfile } from '@/features/dashboard/user/settings/api/profileClient';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { Sidebar } from './components/sidebar/Sidebar';
import { WelcomeGuideModal } from './components/welcome/WelcomeGuideModal';
import styles from './DashboardShell.module.css';

export function DashboardShell({ children }: { children: React.ReactNode }) {
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
      const hasSeenGuide = localStorage.getItem('has_seen_welcome_guide');

      try {
        const user = await getCurrentUser();
        if (!user) {
          router.replace('/login');
          return;
        }

        if (pathname === '/settings' || hasSeenGuide === 'true') {
          setIsChecking(false);
          return;
        }

        const profileData = await getProfile();

        if (!profileData || !profileData.name || profileData.name.trim() === '') {
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

  const handleCloseGuide = () => setShowGuide(false);

  if (pathname === '/login') return <>{children}</>;
  if (isChecking) return <div className={styles.loading}>loading...</div>;

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
      <WelcomeGuideModal isOpen={showGuide} onClose={handleCloseGuide} />
    </div>
  );
}
