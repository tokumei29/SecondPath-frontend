import { cache } from 'react';
import { cookies } from 'next/headers';

export type AdminTextSupportListItem = {
  id: string | number;
  status: 'waiting' | 'replied' | string;
  created_at: string;
  user_id: string;
  name?: string | null;
  email?: string | null;
  subject?: string | null;
  message?: string | null;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getAdminTextSupports = cache(async (): Promise<AdminTextSupportListItem[]> => {
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not set');
  }

  // src/api/client.ts と同じ思想で UUID を送る（Server では localStorage が使えないため cookie から読む）
  // cookie 名はプロジェクト側で将来統一する想定。存在しない場合はヘッダーを付けない。
  const cookieStore = await cookies();
  const uuid = cookieStore.get('user_uuid')?.value;

  const res = await fetch(`${baseUrl}/admin/text_supports`, {
    // 近い将来に cookie 認証にする場合も考えて credentials を付けておく
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(uuid ? { 'X-User-Id': uuid } : {}),
    },
    // 一覧の更新頻度が高すぎない想定で軽くキャッシュ
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch admin text supports: ${res.status}`);
  }

  return await res.json();
});
