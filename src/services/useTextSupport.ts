import useSWR from 'swr';
import {
  getTextSupports,
  getTextSupportDetail,
  createTextSupport,
  postSupportMessage,
  TextSupportPayload,
} from '@/api/textSupport';

// --- ユーザー用：相談一覧 ---
export const useTextSupports = () => {
  const { data, error, mutate, isLoading } = useSWR('/text_supports', getTextSupports);

  const supports = data || [];

  // 既読判定ロジックをフックに内包
  const checkIsRead = (support: any) => {
    if (support.status !== 'replied') return false;
    const lastRead = localStorage.getItem(`read_support_${support.id}`);
    if (!lastRead) return false;
    return new Date(lastRead).getTime() > new Date(support.updated_at).getTime();
  };

  const create = async (payload: TextSupportPayload) => {
    const result = await createTextSupport(payload);
    await mutate(); // 新しい相談を送ったら一覧を更新
    return result;
  };

  return {
    supports,
    checkIsRead, // 判定関数も返す
    isLoading,
    isError: error,
    create,
  };
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
