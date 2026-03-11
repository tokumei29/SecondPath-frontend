'use client';

import Link from 'next/link';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from './sidebar.module.css';
import { SidebarItem } from './sidebarItem';

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const userId = params?.userId as string;

  const handleLogout = async () => {
    if (!window.confirm('ログアウトしますか？')) return;
    try {
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (error) {
      alert('ログアウトに失敗しました');
    }
  };

  const getPath = (path: string) => `/${userId}${path}`;

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
        </div>

        {/* アセスメント（心理鑑定）グループ */}
        <div className={styles.navGroup}>
          <div className={styles.navLabel}>アセスメント</div>
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
        <div className={styles.navGroup}>
          <SidebarItem
            href={getPath('/community')}
            active={pathname.includes('/community')}
            icon="🌍"
            label="匿名の広場"
          />
        </div>

        <div className={styles.footer}>
          <button type="button" onClick={handleLogout} className={styles.logoutButton}>
            🚪 ログアウト
          </button>
        </div>
      </nav>
    </aside>
  );
};
