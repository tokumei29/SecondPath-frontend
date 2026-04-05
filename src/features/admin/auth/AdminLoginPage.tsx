'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { shouldUseDemoAdminPassword } from '@/lib/adminLoginHost';
import styles from './AdminLoginPage.module.css';

export function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const useDemo = shouldUseDemoAdminPassword(window.location.hostname);
    const expectedPassword = useDemo
      ? process.env.NEXT_PUBLIC_ADMIN_PASSWORD_DEMO
      : process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (password === expectedPassword) {
      const session = {
        authenticated: true,
        expiresAt: Date.now() + 1000 * 60 * 60 * 12,
      };
      localStorage.setItem('admin_session', JSON.stringify(session));
      router.push('/adminDashboard');
    } else {
      alert('認証に失敗しました。アクセス権限を確認してください。');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleLogin}>
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
}
