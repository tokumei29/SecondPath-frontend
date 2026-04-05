import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { isLocalhostOrDemoDeploy } from '@/lib/demoFrontendHost';

const urlProd = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const keyProd = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const urlDemo = process.env.NEXT_PUBLIC_SUPABASE_URL_DEMO;
const keyDemo = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEMO;

let clientProd: SupabaseClient | null = null;
let clientDemo: SupabaseClient | null = null;

/**
 * ブラウザ上で localhost / デモドメインのときはデモ用 Supabase、それ以外は本番用。
 * デモ用 env が未設定のときは本番にフォールバック（警告のみ）。
 */
export function getSupabase(): SupabaseClient {
  const useDemo =
    typeof window !== 'undefined' && isLocalhostOrDemoDeploy(window.location.hostname);
  const hasDemoConfig = Boolean(urlDemo?.trim() && keyDemo?.trim());

  if (useDemo && hasDemoConfig) {
    if (!clientDemo) {
      clientDemo = createClient(urlDemo!.trim(), keyDemo!.trim());
    }
    return clientDemo;
  }

  if (useDemo && !hasDemoConfig && process.env.NODE_ENV === 'development') {
    console.warn(
      '[SecondPath] NEXT_PUBLIC_SUPABASE_URL_DEMO / NEXT_PUBLIC_SUPABASE_ANON_KEY_DEMO が未設定のため本番 Supabase に接続しています。'
    );
  }

  if (!clientProd) {
    clientProd = createClient(urlProd, keyProd);
  }
  return clientProd;
}

/**
 * 現在ログインしているユーザー情報を取得する
 */
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await getSupabase().auth.getUser();
  if (error) return null;
  return user;
};

/**
 * 新規ユーザー登録
 */
export const signUp = async (email: string, pass: string) => {
  return await getSupabase().auth.signUp({
    email,
    password: pass,
  });
};

/**
 * ログイン
 */
export const signIn = async (email: string, pass: string) => {
  return await getSupabase().auth.signInWithPassword({
    email,
    password: pass,
  });
};

/**
 * ログアウト
 */
export const signOut = async () => {
  return await getSupabase().auth.signOut();
};

// パスワードリセットメールを送信する
export const resetPasswordRequest = async (email: string) => {
  const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/resetPassword/update`,
  });
  return { error };
};

// 新しいパスワードを保存する（ログインした状態で呼ばれる）
export const updatePassword = async (newPassword: string) => {
  const { error } = await getSupabase().auth.updateUser({
    password: newPassword,
  });
  return { error };
};
