import useSWR, { useSWRConfig } from 'swr';
import {
  getMyRecords,
  getMyRecord,
  getUserRecords,
  createUserRecord,
  updateUserRecord,
  deleteUserRecord,
  CounselingRecord,
} from '@/api/userRecords';

// ==========================================
// 1. 閲覧用フック (Query: GET担当)
// ==========================================

/** 【ユーザー用】自分の記録一覧 */
export const useMyRecords = () => {
  const { data, error, mutate, isLoading } = useSWR<CounselingRecord[]>(
    '/user_records',
    getMyRecords
  );

  const hasTodayAdvice =
    data && data.length > 0
      ? (() => {
          const latestAdvice = data[0];
          const todayStr = new Date().toLocaleDateString('sv-SE');
          return latestAdvice.date.includes(todayStr);
        })()
      : false;

  return {
    records: data,
    hasTodayAdvice,
    isLoading,
    isError: error,
    mutate,
  };
};

/** 【ユーザー用】特定の記録詳細 */
export const useMyRecordDetail = (id?: string) => {
  const { data, error, mutate, isLoading } = useSWR(id ? `/user_records/${id}` : null, () =>
    getMyRecord(id!)
  );
  return { record: data, isLoading, isError: error, mutate };
};

/** 【管理者用】特定ユーザーのカルテ一覧 */
export const useAdminUserRecords = (userId?: string) => {
  const { data, error, mutate, isLoading } = useSWR(
    userId ? `/admin/users/${userId}/user_records` : null,
    () => getUserRecords(userId!)
  );
  return {
    records: data?.data || data,
    isLoading,
    isError: error,
    mutate,
  };
};

// ==========================================
// 2. 操作用フック (Command: POST/PATCH/DELETE担当)
// ==========================================

/** 【管理者用】カルテの作成・更新・削除アクション */
export const useAdminRecordActions = () => {
  const { mutate: globalMutate } = useSWRConfig();

  // 作成
  const create = async (userId: string, date: string, content: string) => {
    const result = await createUserRecord(userId, date, content);
    // 管理者側の特定ユーザーの一覧キャッシュを更新
    await globalMutate(`/admin/users/${userId}/user_records`);
    // ユーザー側の自分の記録一覧も古くなるので更新を促す
    await globalMutate('/user_records');
    return result;
  };

  // 更新
  const update = async (userId: string, recordId: string, content: string) => {
    const result = await updateUserRecord(recordId, content);
    await globalMutate(`/admin/users/${userId}/user_records`);
    await globalMutate(`/user_records/${recordId}`);
    return result;
  };

  // 削除
  const remove = async (userId: string, recordId: string) => {
    await deleteUserRecord(recordId);
    await globalMutate(`/admin/users/${userId}/user_records`);
    await globalMutate('/user_records');
  };

  return { create, update, remove };
};
