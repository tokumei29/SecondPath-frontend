import useSWR, { useSWRConfig } from 'swr';
import {
  getDiaries,
  getDiary,
  createDiary,
  updateDiary,
  deleteDiary,
  DiaryPayload,
} from '@/api/diaries';

// ==========================================
// 1. 閲覧用フック (GET担当)
// ==========================================

/** 【一覧用】日報リストを取得 */
export const useDiaries = () => {
  const { data, error, mutate, isLoading } = useSWR('/diaries', getDiaries);
  return {
    diaries: data?.data || [],
    isLoading,
    isError: error,
    mutate, // 一覧を再取得したい時に使用
  };
};

/** 【詳細用】特定の日報を取得 */
export const useDiaryDetail = (diaryId?: string) => {
  const { data, error, mutate, isLoading } = useSWR(diaryId ? `/diaries/${diaryId}` : null, () =>
    getDiary(diaryId!)
  );
  return {
    diary: data?.data || data,
    isLoading,
    isError: error,
    mutate,
  };
};

// ==========================================
// 2. 操作用フック (POST/PATCH/DELETE担当)
// ==========================================

/** 【操作用】作成・更新・削除を実行 */
export const useDiaryActions = () => {
  const { mutate: globalMutate } = useSWRConfig();

  // 作成
  const create = async (payload: DiaryPayload) => {
    const result = await createDiary(payload);
    await globalMutate('/diaries'); // 一覧キャッシュを更新
    return result;
  };

  // 更新
  const update = async (id: string, payload: DiaryPayload) => {
    const result = await updateDiary(id, payload);
    await globalMutate(`/diaries/${id}`); // 詳細キャッシュを更新
    return result;
  };

  // 削除
  const remove = async (id: string) => {
    await deleteDiary(id);
    await globalMutate('/diaries'); // 一覧キャッシュを更新
    // 詳細のキャッシュも消しておく
    await globalMutate(`/diaries/${id}`, null, false);
  };

  return { create, update, remove };
};
