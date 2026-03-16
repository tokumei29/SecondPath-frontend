import useSWR from 'swr';
import {
  getMyRecords,
  getMyRecord,
  getUserRecords,
  createUserRecord,
  updateUserRecord,
  deleteUserRecord,
  CounselingRecord,
} from '@/api/userRecords';

// --- ユーザー用：自分の記録一覧 ---
export const useMyRecords = () => {
  const { data, error, mutate, isLoading } = useSWR<CounselingRecord[]>(
    '/user_records',
    getMyRecords
  );

  // ダッシュボードでも使った「今日のアドバイスがあるか」の判定
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

// --- ユーザー用：特定の記録詳細 ---
export const useMyRecordDetail = (id?: string) => {
  const { data, error, mutate, isLoading } = useSWR(id ? `/user_records/${id}` : null, () =>
    getMyRecord(id!)
  );

  return {
    record: data,
    isLoading,
    isError: error,
    mutate,
  };
};

// --- 管理者用：特定ユーザーのカルテ操作 ---
export const useAdminUserRecords = (userId?: string) => {
  const { data, error, mutate, isLoading } = useSWR(
    userId ? `/admin/users/${userId}/user_records` : null,
    () => getUserRecords(userId!)
  );

  const create = async (date: string, content: string) => {
    if (!userId) return;
    const result = await createUserRecord(userId, date, content);
    await mutate(); // 保存後に一覧を更新
    return result;
  };

  const update = async (recordId: string, content: string) => {
    const result = await updateUserRecord(recordId, content);
    await mutate();
    return result;
  };

  const remove = async (recordId: string) => {
    await deleteUserRecord(recordId);
    await mutate();
  };

  return {
    records: data?.data || data, // APIのレスポンス形式に合わせて調整
    isLoading,
    isError: error,
    create,
    update,
    remove,
  };
};
