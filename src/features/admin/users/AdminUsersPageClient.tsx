'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getAllUsers } from '@/features/admin/users/api/usersClient';
import { formatJapanLocaleDateTime } from '@/lib/utils';
import styles from './AdminUsersPage.module.css';
import type { AdminUserListItem } from './api/getAdminUsersServer';

export function AdminUsersPageClient({ initialUsers }: { initialUsers: AdminUserListItem[] }) {
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = useCallback(async (query?: string) => {
    setLoading(true);
    try {
      const res = await getAllUsers(query);
      setUsers(res.data || []);
    } catch (err) {
      console.error('ユーザー取得失敗:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // SSRで初期表示しつつ、クライアント側でも最新化
  useEffect(() => {
    fetchUsers('').catch(() => undefined);
  }, [fetchUsers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchUsers]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>👥 ユーザー一覧</h1>
        <p>全ユーザーの活動状況を確認できます</p>
      </header>

      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="ユーザー名で検索..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>名前</th>
              <th>UUID</th>
              <th>登録日</th>
              <th className={styles.textCenter}>アクション</th>
              <th>カルテ</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const withdrawn = Boolean(user.account_withdrawn_at);
              return (
              <tr key={user.id} className={withdrawn ? styles.rowWithdrawn : undefined}>
                <td className={styles.userCell}>
                  <div className={styles.userNameRow}>
                    <span className={styles.userName}>{user.name || '名前未設定'}</span>
                    {withdrawn && (
                      <span
                        className={styles.withdrawnBadge}
                        title={
                          user.account_withdrawn_at
                            ? `退会日時: ${formatJapanLocaleDateTime(user.account_withdrawn_at)}`
                            : '退会済み'
                        }
                      >
                        <span className={styles.withdrawnBadgeIcon} aria-hidden>
                          🚪
                        </span>
                        退会済み
                      </span>
                    )}
                  </div>
                </td>
                <td className={styles.uuidCell}>
                  <code>{user.id}</code>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString('ja-JP')}</td>
                <td className={styles.textCenter}>
                  <Link href={`/adminDashboard/users/${user.id}`} className={styles.viewBtn}>
                    詳細・活動ログ ➔
                  </Link>
                </td>
                <td className={styles.textCenter}>
                  <Link
                    href={`/adminDashboard/users/${user.id}/records`}
                    className={styles.viewBtn}
                  >
                    📋 閲覧・作成
                  </Link>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>

        {!loading && users.length === 0 && (
          <div className={styles.emptyMessage}>一致するユーザーはいません。</div>
        )}
      </div>
    </div>
  );
}
