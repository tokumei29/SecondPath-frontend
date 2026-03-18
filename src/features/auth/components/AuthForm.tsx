'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp, supabase } from '@/api/auth';
import { Modal } from '@/components/ui/Modal/Modal';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import styles from './AuthForm.module.css';
import { SignupSuccessMessage } from './SignupSuccessMessage';

type AuthMode = 'signin' | 'signup';

export const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  useBodyScrollLock(isModalOpen);

  useEffect(() => {
    // localStorage の user_uuid だけでログイン判定すると、
    // セッション切れ時に /login <-> /home のループになるので Supabase のセッションで判定する
    const run = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        // セッションの有効期限は見ず、「ユーザーとアクセストークンが存在するか」だけで判定する
        const isValid = !!session?.user && !!session?.access_token;
        if (!isValid) return;

        localStorage.setItem('user_uuid', session.user.id);
        document.cookie = `user_uuid=${session.user.id}; path=/; max-age=31536000; SameSite=Lax`;
        router.replace('/home');
        router.refresh();
      } finally {
        setIsAuthChecking(false);
      }
    };
    run().catch(() => setIsAuthChecking(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || isAuthChecking) return;
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password);
        if (error) throw error;
        setIsModalOpen(true);
      } else {
        const { data, error } = await signIn(email, password);
        if (error) throw error;

        if (data.user) {
          const userId = data.user.id;
          localStorage.setItem('user_uuid', userId);
          document.cookie = `user_uuid=${userId}; path=/; max-age=31536000; SameSite=Lax`;
          router.push('/home');
          router.refresh();
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
    setMode('signin');
    setPassword('');
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
          disabled={loading || isAuthChecking}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          className={styles.input}
          required
          disabled={loading || isAuthChecking}
        />
        <button type="submit" disabled={loading || isAuthChecking} className={styles.button}>
          {isAuthChecking
            ? '確認中...'
            : loading
              ? '処理中...'
              : mode === 'signin'
                ? 'ログイン'
                : '登録する'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
        className={styles.switchButton}
        disabled={loading || isAuthChecking}
      >
        {mode === 'signin'
          ? 'アカウントをお持ちでない方はこちら（サインアップへ）'
          : '既にアカウントをお持ちの方はこちら'}
      </button>
      <button
        type="button"
        onClick={() => router.push('/resetPassword')}
        className={styles.switchButton}
        disabled={loading || isAuthChecking}
      >
        パスワードをお忘れの場合
      </button>

      <Modal isOpen={isModalOpen} title="アカウント作成完了">
        <SignupSuccessMessage email={email} onConfirm={handleCloseModal} />
      </Modal>
    </div>
  );
};
