'use client';

import { useState } from 'react';
import { resetPasswordRequest } from '@/api/auth';
import styles from './page.module.css';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await resetPasswordRequest(email);
    if (error) {
      alert('送信に失敗しました: ' + error.message);
    } else {
      setSent(true);
    }
  };

  if (sent) return <div className={styles.message}>再設定用のリンクをメールで送信しました。</div>;

  return (
    <div className={styles.container}>
      <h2>パスワード再設定</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input 
          type="email" 
          placeholder="登録メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
          className={styles.input}
        />
        <button type="submit" className={styles.button}>再設定メールを送る</button>
      </form>
    </div>
  );
}

export default ResetPasswordPage;