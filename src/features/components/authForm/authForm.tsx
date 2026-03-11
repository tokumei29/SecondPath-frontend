'use client';

import React, { useState } from 'react';
import { signIn, signUp } from '@/api/auth';
import { useRouter } from 'next/navigation';
import styles from './authForm.module.css'; // 既存のスタイルを利用

import { Modal } from '@/features/components/common/modal';
import { SignupSuccessMessage } from '@/features/components/signup/signupSuccessMessage';

type AuthMode = 'signin' | 'signup';

export const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password);
        if (error) throw error;
        // 成功したらモーダルを表示
        setIsModalOpen(true);
      } else {
        const { data, error } = await signIn(email, password);
        if (error) throw error;
        if (data.session) {
          router.push('/home');
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMode('signin'); // ログイン画面へ切り替え
    setPassword(''); // パスワードをクリア
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{mode === 'signin' ? 'ログイン' : '新規登録'}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? '処理中...' : mode === 'signin' ? 'ログイン' : '登録する'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
        className={styles.switchButton}
      >
        {mode === 'signin'
          ? 'アカウントをお持ちでない方はこちら'
          : '既にアカウントをお持ちの方はこちら'}
      </button>

      {/* 共通モーダルの中に成功メッセージを流し込む */}
      <Modal isOpen={isModalOpen} title="アカウント作成完了">
        <SignupSuccessMessage email={email} onConfirm={handleCloseModal} />
      </Modal>
    </div>
  );
};
