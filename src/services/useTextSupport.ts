import useSWR, { useSWRConfig } from 'swr'; // mutateのために追加
import {
  getTextSupports,
  getTextSupportDetail,
  createTextSupport,
  postSupportMessage,
  TextSupportPayload,
} from '@/api/textSupport';

/**
 * 【一覧・表示用】GET担当
 */
export const useTextSupports = () => {
  const { data, error, mutate, isLoading } = useSWR('/text_supports', getTextSupports);

  const supports = data || [];

  // 既読判定
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

export const useCreateTextSupport = () => {
  const create = async (payload: TextSupportPayload) => await createTextSupport(payload);
  return { create };
};

// ==========================================
// 1. 詳細閲覧用フック (Query: GET担当)
// ==========================================
/**
 * 相談詳細（チャット画面）を表示するためだけのフック。
 * メッセージ送信ロジックを持たないため、入力中の再描画による通信を抑制できます。
 */
export const useTextSupportDetail = (id?: string | number) => {
  const { data, error, mutate, isLoading } = useSWR(id ? `/text_supports/${id}` : null, () =>
    getTextSupportDetail(id!)
  );

  const detail = data?.data || data;

  return {
    detail,
    isLoading,
    isError: error,
    mutate, // 手動リロード用
  };
};

// ==========================================
// 2. メッセージ操作用フック (Command: POST担当)
// ==========================================
/**
 * 返信メッセージを送るためだけのフック。
 * useSWR を内包していないので、タイピング中に GET リクエストが走ることはありません。
 */
export const useTextSupportActions = () => {
  const { mutate: globalMutate } = useSWRConfig();

  const addMessage = async (id: string | number, content: string) => {
    const result = await postSupportMessage(id, content);

    // 送信成功後、このチャット詳細のキャッシュを更新して画面に反映
    await globalMutate(`/text_supports/${id}`);

    // 一覧画面のステータス（「相談中」など）も更新される可能性があるため、一覧も更新
    await globalMutate('/text_supports');

    return result;
  };

  return { addMessage };
};
