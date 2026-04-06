import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { apiBaseUrlFromHost } from '@/lib/apiBaseUrl';
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

type RailsWithdrawalBody = { updated?: boolean; reason?: string; message?: string };

/** Supabase でユーザー削除が済んだあとに、Rails の account_withdrawn_at を立てる。シークレット未設定時はスキップ（ログのみ）。 */
async function markAccountWithdrawnOnRails(
  req: Request,
  supabaseId: string
): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  const secret = process.env.ACCOUNT_WITHDRAWAL_INTERNAL_SECRET?.trim();
  if (!secret) {
    console.warn(
      '[delete-account] ACCOUNT_WITHDRAWAL_INTERNAL_SECRET 未設定のため、Rails の account_withdrawn_at は更新されません（Vercel / .env に同一値を設定）'
    );
    return { ok: true };
  }

  const base = apiBaseUrlFromHost(requestHostname(req));
  const res = await fetch(`${base}/internal/mark_account_withdrawn`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Internal-Secret': secret,
    },
    body: JSON.stringify({ supabase_id: supabaseId }),
  });

  const text = await res.text().catch(() => '');
  let data: RailsWithdrawalBody = {};
  if (text) {
    try {
      data = JSON.parse(text) as RailsWithdrawalBody;
    } catch {
      /* 非 JSON のエラーページ等 */
    }
  }

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      message: text || data.message || '退会フラグの更新に失敗しました',
    };
  }

  if (data.updated === false) {
    return {
      ok: false,
      status: res.status,
      message: `Rails: ${data.reason ?? 'unknown'}${data.message ? ` (${data.message})` : ''}`,
    };
  }

  return { ok: true };
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

    const withdrawn = await markAccountWithdrawnOnRails(req, userId);
    if (!withdrawn.ok) {
      console.error(
        '[delete-account] Supabase 削除後に Rails の退会フラグ更新に失敗:',
        withdrawn.message
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
