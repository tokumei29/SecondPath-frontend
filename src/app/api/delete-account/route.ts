import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isLocalhostOrDemoDeploy } from '@/lib/demoFrontendHost';

function requestHostname(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-host');
  const host = forwarded ?? req.headers.get('host') ?? '';
  return host.split(':')[0].toLowerCase();
}

function supabaseAdminConfig(req: Request): { url: string; serviceRoleKey: string } | null {
  const demo = isLocalhostOrDemoDeploy(requestHostname(req));
  if (demo) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL_DEMO?.trim();
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY_DEMO?.trim();
    if (url && serviceRoleKey) return { url, serviceRoleKey };
    return null;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (url && serviceRoleKey) return { url, serviceRoleKey };
  return null;
}

export async function POST(req: Request) {
  try {
    const config = supabaseAdminConfig(req);
    if (!config) {
      return NextResponse.json({ error: 'サーバーの設定ミスです' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'ユーザーIDが提供されていません' }, { status: 400 });
    }

    const supabaseAdmin = createClient(config.url, config.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
          status: (error as { status?: number }).status || 500,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'ユーザーが削除されました' });
  } catch {
    return NextResponse.json(
      { error: 'サーバー内で予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}
