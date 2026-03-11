import { createClient } from '@supabase/supabase-js';

// Supabaseの管理画面から取得するURLとAnon Keyを使います
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabaseクライアントの初期化
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 新規ユーザー登録 (Sign Up)
 */
export const signUp = async (email: string, pass: string) => {
  return await supabase.auth.signUp({
    email: email,
    password: pass,
  });
};

/**
 * ログイン (Sign In)
 */
export const signIn = async (email: string, pass: string) => {
  return await supabase.auth.signInWithPassword({
    email: email,
    password: pass,
  });
};

/**
 * ログアウト (Sign Out)
 */
export const signOut = async () => {
  return await supabase.auth.signOut();
};
