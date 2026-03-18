'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/api/auth';
import { Modal } from '@/components/ui/Modal/Modal';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { createClient } from '@/lib/supabase/client';
import styles from './AuthForm.module.css';
import { SignupSuccessMessage } from './SignupSuccessMessage';

type AuthMode = 'signin' | 'signup';

export const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useBodyScrollLock(isModalOpen);

  useEffect(() => {
    // localStorage の user_uuid だけでログイン判定すると、
    // セッション切れ時に /login <-> /home のループになるので Supabase のセッションで判定する
    const run = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      const expiresAtMs =
        typeof session?.expires_at === 'number' ? session.expires_at * 1000 : 0;
      const isValid =
        !!session?.user && !!session?.access_token && (expiresAtMs === 0 || expiresAtMs > Date.now());
      if (!isValid) return;

      localStorage.setItem('user_uuid', session.user.id);
      document.cookie = `user_uuid=${session.user.id}; path=/; max-age=31536000; SameSite=Lax`;
      router.replace('/home');
      router.refresh();
    };
    run().catch(() => undefined);
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          ? 'アカウントをお持ちでない方はこちら（サインアップへ）'
          : '既にアカウントをお持ちの方はこちら'}
      </button>
      <button
        type="button"
        onClick={() => router.push('/resetPassword')}
        className={styles.switchButton}
      >
        パスワードをお忘れの場合
      </button>

      <Modal isOpen={isModalOpen} title="アカウント作成完了">
        <SignupSuccessMessage email={email} onConfirm={handleCloseModal} />
      </Modal>
    </div>
  );
};
