'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getTextSupports } from '@/api/textSupport';
import { createClient } from '@/lib/supabase/client';
import styles from './sidebar.module.css';
import { SidebarItem } from './sidebarItem';

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [hasUnread, setHasUnread] = useState(false);

  // チャットの既読判定
  useEffect(() => {
    const checkUnreadStatus = async () => {
      try {
        const supports = await getTextSupports();
        const unreadExists = supports.some((support: any) => {
          if (support.status !== 'replied') return false;

          const lastRead = localStorage.getItem(`read_support_${support.id}`);
          if (!lastRead) return true; // 未読

          return new Date(lastRead).getTime() < new Date(support.updated_at).getTime(); // 更新が新しいなら未読
        });

        setHasUnread(unreadExists);
      } catch (error) {
        console.error('未読チェック失敗', error);
      }
    };

    checkUnreadStatus();
  }, [pathname]);

  const handleLogout = async () => {
    if (!window.confirm('ログアウトしますか？')) return;
    try {
      await supabase.auth.signOut();
      window.localStorage.clear();
      router.push('/login');
      router.refresh();
    } catch (error) {
      alert('ログアウトに失敗しました');
    }
  };

  const getPath = (path: string) => path;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTitle}>SecondPath</div>

      <nav className={styles.nav}>
        {/* メインメニュー */}
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
            label="カウンセラーからのアドバイス（復帰支援・方針）"
          />
        </div>
        <div className={styles.navGroup}>
          <div className={styles.navLabel}>カウンセラーに相談する</div>
          <SidebarItem
            href={getPath('/textSupport/new')}
            active={pathname.includes('/textSupport/new')}
            icon="💬"
            label="カウンセラーにテキストで相談する（サービス期間中無制限無料）"
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

        {/* アセスメント（心理鑑定）グループ */}
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

          {/* 追加：レジリエンス診断 */}
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

          {/* 認知の歪み診断（CDD） ★ */}
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

        {/* その他 */}
        {/* <div className={styles.navGroup}>
          <SidebarItem
            href={getPath('/community')}
            active={pathname.includes('/community')}
            icon="🌍"
            label="匿名の広場"
          />
        </div> */}

        <div className={styles.footer}>
          <button type="button" onClick={handleLogout} className={styles.logoutButton}>
            🚪 ログアウト
          </button>
        </div>
      </nav>
    </aside>
  );
};
