'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePassword } from '@/api/auth';
import styles from './PasswordUpdatePage.module.css';

export const PasswordUpdatePage = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await updatePassword(password);
      if (error) {
        alert('更新に失敗しました: ' + error.message);
      } else {
        alert('パスワードを更新しました。新しいパスワードでログインしてください。');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>新しいパスワードの設定</h2>
        <p className={styles.description}>安全なパスワードを入力して更新を完了させてください。</p>

        <form onSubmit={handleUpdate} className={styles.form}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="新しいパスワード"
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? '更新中...' : 'パスワードを更新する'}
          </button>
        </form>
      </div>
    </div>
  );
};
