'use client';

import { useState } from 'react';
import { resetPasswordRequest } from '@/api/auth';
import styles from './page.module.css';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // 送信開始時に true にする

    try {
      const { error } = await resetPasswordRequest(email);
      if (error) {
        alert('送信に失敗しました: ' + error.message);
      } else {
        setSent(true);
      }
    } finally {
      setLoading(false);
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
          disabled={loading} // 送信中は入力もできないようにする
          className={styles.input}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={loading} // 送信中はボタンを非活性にする
        >
          {loading ? '送信中...' : '再設定メールを送る'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
