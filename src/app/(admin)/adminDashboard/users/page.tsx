'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllUsers } from '@/api/users';
import styles from './page.module.css';

const AdminUsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.data || []);
      } catch (err) {
        console.error('ユーザー取得失敗:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>👥 ユーザー一覧</h1>
        <p>全ユーザーの活動状況を確認できます</p>
      </header>

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
      </div>
    </div>
  );
};

export default AdminUsersPage;
