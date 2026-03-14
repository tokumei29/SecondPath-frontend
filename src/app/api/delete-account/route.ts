import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    // 1. 環境変数のチェック（ターミナルで確認するため）
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'サーバーの設定ミスです' }, { status: 500 });
    }

    // 2. リクエストボディの取得
    const body = await req.json().catch(() => ({}));
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'ユーザーIDが提供されていません' }, { status: 400 });
    }

    // 3. 管理者クライアントの作成
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 4. Supabase管理者APIを利用してユーザーを物理削除
    // ※ ここでコケる場合は、以前作ったSQL関数との競合（外部キー制約）の可能性があります
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
          status: (error as any).status || 500,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'ユーザーが削除されました' });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'サーバー内で予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}
