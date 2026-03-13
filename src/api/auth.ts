import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 現在ログインしているユーザー情報を取得する
 */
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) return null;
  return user;
};

/**
 * 新規ユーザー登録
 */
export const signUp = async (email: string, pass: string) => {
  return await supabase.auth.signUp({
    email,
    password: pass,
  });
};

/**
 * ログイン
 */
export const signIn = async (email: string, pass: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });
};

/**
 * ログアウト
 */
export const signOut = async () => {
  return await supabase.auth.signOut();
};

// パスワードリセットメールを送信する
export const resetPasswordRequest = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/resetPassword/update`,
  });
  return { error };
};

// 新しいパスワードを保存する（ログインした状態で呼ばれる）
export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  return { error };
};