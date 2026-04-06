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

type RailsWithdrawalJson = {
  updated?: boolean;
  reason?: string;
  message?: string;
  error?: string;
};

/**
 * 先に Rails で account_withdrawn_at を立てる（Supabase auth 削除より前）。
 * シークレット未設定時は Rails を呼ばず失敗とする（成功扱いで握りつぶさない）。
 */
async function markAccountWithdrawnOnRails(
  req: Request,
  supabaseId: string
): Promise<
  | { outcome: 'secret_unset' }
  | { outcome: 'rails_ok' }
  | { outcome: 'rails_no_user_row' }
  | { outcome: 'rails_failed'; status: number; message: string }
> {
  const secret = process.env.ACCOUNT_WITHDRAWAL_INTERNAL_SECRET?.trim();
  if (!secret) {
    return { outcome: 'secret_unset' };
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
  let data: RailsWithdrawalJson = {};
  if (text) {
    try {
      data = JSON.parse(text) as RailsWithdrawalJson;
    } catch {
      /* 非 JSON */
    }
  }

  if (!res.ok) {
    return {
      outcome: 'rails_failed',
      status: res.status,
      message: text || data.message || data.error || '退会フラグの更新に失敗しました',
    };
  }

  if (data.updated === false && data.reason === 'user_not_found') {
    console.warn(
      '[delete-account] Rails に users 行がありません（supabase_id 未同期）。Auth のみ削除します。'
    );
    return { outcome: 'rails_no_user_row' };
  }

  if (data.updated === false) {
    return {
      outcome: 'rails_failed',
      status: res.status,
      message: `Rails: ${data.reason ?? 'unknown'}${data.message ? ` (${data.message})` : ''}`,
    };
  }

  return { outcome: 'rails_ok' };
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

    const withdrawn = await markAccountWithdrawnOnRails(req, userId);

    if (withdrawn.outcome === 'secret_unset') {
      console.error(
        '[delete-account] ACCOUNT_WITHDRAWAL_INTERNAL_SECRET が未設定のため退会を中止しました（Rails を呼んでいません）'
      );
      return NextResponse.json(
        {
          error:
            '退会処理のサーバー設定が不完全です。ACCOUNT_WITHDRAWAL_INTERNAL_SECRET を Vercel（および必要ならローカル .env）に設定してください。',
          code: 'ACCOUNT_WITHDRAWAL_SECRET_UNSET',
        },
        { status: 503 }
      );
    }

    if (withdrawn.outcome === 'rails_failed') {
      console.error('[delete-account] Rails の退会フラグ更新に失敗したため Supabase の削除は行いません:', withdrawn.message);
      return NextResponse.json(
        {
          error: '退会記録の保存に失敗しました。しばらくしてから再度お試しください。',
          detail: withdrawn.message,
        },
        { status: withdrawn.status >= 400 && withdrawn.status < 600 ? withdrawn.status : 502 }
      );
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
