import useSWR, { useSWRConfig } from 'swr'; // useSWRConfig を追加
import {
  getDiaries,
  getDiary,
  createDiary,
  updateDiary,
  deleteDiary,
  DiaryPayload,
} from '@/api/diaries';

// --- 一覧用フック ---
export const useDiaries = () => {
  const { data, error, mutate, isLoading } = useSWR('/diaries', getDiaries);

  const diaries = data?.data || [];

  const create = async (payload: DiaryPayload) => {
    const result = await createDiary(payload);
    await mutate();
    return result;
  };

  return {
    diaries,
    isLoading,
    isError: error,
    create,
    mutate,
  };
};

// --- 詳細・操作用フック ---
export const useDiary = (diaryId?: string) => {
  const { mutate: globalMutate } = useSWRConfig();
  const { data, error, mutate, isLoading } = useSWR(diaryId ? `/diaries/${diaryId}` : null, () =>
    getDiary(diaryId!)
  );

  // 更新処理（基本は詳細ページ用）
  const update = async (payload: DiaryPayload) => {
    if (!diaryId) return;
    const result = await updateDiary(diaryId, payload);
    await mutate();
    globalMutate('/diaries');
    return result;
  };

  // ★ 削除処理を「引数対応」にアップグレード
  const remove = async (targetId?: string) => {
    // 引数で ID が渡されればそれを、なければフック初期化時の ID を使う
    const id = targetId || diaryId;
    if (!id) {
      console.error('削除するIDが指定されていません');
      return;
    }

    await deleteDiary(id);

    // 削除したので一覧キャッシュを更新
    globalMutate('/diaries');

    // もし詳細ページで自分自身を消したなら、自身のキャッシュもクリアする
    if (id === diaryId) {
      mutate(null);
    }
  };

  return {
    diary: data?.data || data,
    isLoading,
    isError: error,
    update,
    remove, // これで remove("123") のように呼べるようになります
  };
};
