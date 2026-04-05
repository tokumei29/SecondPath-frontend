'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getSupabase } from '@/api/auth';
import { getTextSupports } from '@/features/dashboard/user/textSupport/api/textSupportClient';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { DeleteAccountModal } from './DeleteAccountModal';
import styles from './Sidebar.module.css';
import { SidebarItem } from './SidebarItem';

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [supports, setSupports] = useState<any[]>([]);

  useEffect(() => {
    // 既読バッジ用途なので、軽量に一度だけ取得
    const fetchSupports = async () => {
      try {
        const res = await getTextSupports();
        setSupports(res?.data || res || []);
      } catch (e) {
        console.error(e);
        setSupports([]);
      }
    };
    fetchSupports();
  }, []);

  const hasUnread =
    supports?.some((support: any) => {
      if (support.status !== 'replied') return false;
      const lastRead = localStorage.getItem(`read_support_${support.id}`);
      if (!lastRead) return true;
      return new Date(lastRead).getTime() < new Date(support.updated_at).getTime();
    }) ?? false;

  useBodyScrollLock(isDeleteModalOpen);

  const handleLogout = async () => {
    if (!window.confirm('ログアウトしますか？')) return;
    try {
      await getSupabase().auth.signOut();
      Object.keys(localStorage).forEach((key) => {
        if (!key.startsWith('read_support_')) {
          localStorage.removeItem(key);
        }
      });
      document.cookie = 'user_uuid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
      router.push('/login');
      router.refresh();
    } catch {
      alert('ログアウトに失敗しました');
    }
  };

  const confirmAccountDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const storageKey = Object.keys(localStorage).find(
        (key) => key.startsWith('sb-') && key.endsWith('-auth-token')
      );
      if (!storageKey) {
        alert('セッションが見つかりません。再ログインしてください。');
        return;
      }
      const rawData = localStorage.getItem(storageKey);
      if (!rawData) return;
      const { user, access_token } = JSON.parse(rawData);
      if (!user?.id || !access_token) {
        alert('認証情報の解析に失敗しました。');
        return;
      }
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || '削除に失敗しました。');
      localStorage.clear();
      document.cookie = 'user_uuid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
      alert('アカウントの削除が完了しました。');
      router.push('/');
      router.refresh();
    } catch (e: any) {
      console.error('削除エラー:', e);
      alert(`エラーが発生しました: ${e.message}`);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const getPath = (path: string) => path;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTitle}>SecondPath</div>
      <nav className={styles.nav}>
        <div className={styles.navGroup}>
          <SidebarItem
            href={getPath('/home')}
            active={pathname.includes('/home')}
            icon="🏠"
            label="ダッシュボード"
          />
          <div className={styles.navLabel}>日々の積み重ね</div>
          <SidebarItem
            href={getPath('/settings')}
            active={pathname.includes('/settings')}
            icon="⚙️"
            label="自己分析設定"
          />
          <SidebarItem
            href={getPath('/diaries')}
            active={pathname.endsWith('/diaries')}
            icon="📝"
            label="日報を書く"
          />
          <SidebarItem
            href={getPath('/diaries/history')}
            active={pathname.includes('/diaries/history')}
            icon="📚"
            label="過去の日報記録"
          />
          <SidebarItem
            href={getPath('/counselingRecords')}
            active={pathname.includes('/counselingRecords')}
            icon="📋"
            label="カウンセラーからのフィードバック（支援・方針）"
          />
        </div>
        <div className={styles.navGroup}>
          <div className={styles.navLabel}>カウンセラーに相談する</div>
          <SidebarItem
            href={getPath('/textSupport/new')}
            active={pathname.includes('/textSupport/new')}
            icon="💬"
            // label="カウンセラーにテキストで相談する（サービス期間中無制限無料）"
            label="カウンセラーにテキストで相談する"
          />
          <SidebarItem
            href={getPath('/textSupport')}
            active={pathname === getPath('/textSupport')}
            icon="📂"
            label="テキスト相談の回答確認"
            showBadge={hasUnread}
          />
        </div>
        <div className={styles.navGroup}>
          <div className={styles.navLabel}>記事一覧</div>
          <SidebarItem
            href={getPath('/posts')}
            active={pathname.includes('/posts')}
            icon="📖"
            label="支援記事を読む（適時更新）"
          />
        </div>
        <div className={styles.navGroup}>
          <div className={styles.navLabel}>アセスメント(自分でできる自己分析)</div>
          <SidebarItem
            href={getPath('/phq9')}
            active={pathname.includes('/phq9') && !pathname.includes('history')}
            icon="📊"
            label="PHQ-9 セルフチェック"
          />
          <SidebarItem
            href={getPath('/phq9/history')}
            active={pathname.includes('/phq9/history')}
            icon="📈"
            label="PHQ-9 回復の軌跡"
          />
          <SidebarItem
            href={getPath('/resilience')}
            active={pathname.includes('/resilience') && !pathname.includes('history')}
            icon="🧠"
            label="職業的レジリエンス診断"
          />
          <SidebarItem
            href={getPath('/resilience/history')}
            active={pathname.includes('/resilience/history')}
            icon="📐"
            label="職業的レジリエンスの診断結果"
          />
          <SidebarItem
            href={getPath('/cognitiveDistortions')}
            active={pathname.includes('/cognitiveDistortions') && !pathname.includes('history')}
            icon="🔍"
            label="思考の癖（思考の歪み）診断"
          />
          <SidebarItem
            href={getPath('/cognitiveDistortions/history')}
            active={pathname.includes('/cognitiveDistortions/history')}
            icon="🕸️"
            label="思考の癖の診断結果"
          />
        </div>
        <div className={styles.footer}>
          <button type="button" onClick={handleLogout} className={styles.logoutButton}>
            🚪 ログアウト
          </button>
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className={styles.deleteAccountButton}
          >
            👤 アカウント削除
          </button>
        </div>
      </nav>
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmAccountDelete}
      />
    </aside>
  );
};
