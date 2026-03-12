'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const AdminLoginPage = () => {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // .env.local の NEXT_PUBLIC_ADMIN_PASSWORD と照合
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      // セキュリティ：有効期限付きのセッションを保存
      const session = {
        authenticated: true,
        expiresAt: Date.now() + 1000 * 60 * 60 * 12, // 12時間有効
      };
      localStorage.setItem('admin_session', JSON.stringify(session));
      router.push('/adminDashboard');
    } else {
      alert('認証に失敗しました。アクセス権限を確認してください。');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.loginCard} onSubmit={handleLogin}>
        <h1 className={styles.title}>Secure Login</h1>
        <p className={styles.subtitle}>管理者専用：パスワードを入力してください</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={styles.input}
          autoFocus
        />
        <button type="submit" className={styles.button}>
          ログイン
        </button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
