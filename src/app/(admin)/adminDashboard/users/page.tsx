'use client';

import { useEffect, useState, useCallback } from 'react'; // useCallbackを追加
import Link from 'next/link';
import { getAllUsers } from '@/api/users';
import styles from './page.module.css';

const AdminUsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // 1. 検索クエリの状態追加

  // 2. 検索実行ロジックを関数化
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

  // 3. デバウンス処理（0.5秒待ってから検索）
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

      {/* 4. 検索入力エリアの追加（Memosから移植） */}
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
            {users.map((user) => (
              <tr key={user.id}>
                <td className={styles.userCell}>
                  <div className={styles.userName}>{user.name || '名前未設定'}</div>
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
                    className={styles.recordBtn}
                  >
                    📋 閲覧・作成
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* 検索結果ゼロの表示 */}
        {!loading && users.length === 0 && (
          <div className={styles.emptyMessage}>一致するユーザーはいません。</div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
