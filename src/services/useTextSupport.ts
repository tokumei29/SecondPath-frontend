import useSWR from 'swr';
import {
  getTextSupports,
  getTextSupportDetail,
  createTextSupport,
  postSupportMessage,
  TextSupportPayload,
} from '@/api/textSupport';

/**
 * 【一覧・表示用】GET担当
 * 相談一覧が必要なページ（履歴画面など）だけで使う
 */
export const useTextSupports = () => {
  const { data, error, mutate, isLoading } = useSWR('/text_supports', getTextSupports);

  const supports = data || [];

  const checkIsRead = (support: any) => {
    if (support.status !== 'replied') return false;
    const lastRead = localStorage.getItem(`read_support_${support.id}`);
    if (!lastRead) return false;
    return new Date(lastRead).getTime() > new Date(support.updated_at).getTime();
  };

  return {
    supports,
    checkIsRead,
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * 【作成・送信用】POST担当
 * お問い合わせフォームなど、送るだけのページで使う
 * useSWR を使わないので、ページを開いても GET は 1 回も走りません
 */
export const useCreateTextSupport = () => {
  const create = async (payload: TextSupportPayload) => {
    // APIを叩くだけ。余計な revalidation（304）も発生しない
    return await createTextSupport(payload);
  };

  return { create };
};

// --- ユーザー用：相談詳細・チャットやり取り ---
export const useTextSupportDetail = (id?: string | number) => {
  const { data, error, mutate, isLoading } = useSWR(id ? `/text_supports/${id}` : null, () =>
    getTextSupportDetail(id!)
  );

  // Rails の show レスポンスがそのままオブジェクトなら data、
  // data: { ... } で包まれているなら data.data を使う
  const detail = data?.data || data;

  const addMessage = async (content: string) => {
    if (!id) return;
    const result = await postSupportMessage(id, content);

    // 送信後、この詳細データのキャッシュを再取得して画面を更新
    await mutate();

    // 必要であれば相談一覧（/text_supports）のキャッシュも更新
    // mutate('/text_supports');

    return result;
  };

  return {
    detail,
    isLoading,
    isError: error,
    addMessage,
    mutate, // 手動更新用
  };
};
