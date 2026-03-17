import { cache } from 'react';
import apiClient from '@/api/client';
import type { CounselingRecord } from '@/features/dashboard/user/counselingRecords/api/userRecordsClient';

export const getMyRecordsServer = cache(async (): Promise<CounselingRecord[]> => {
  try {
    const response = await apiClient.get('/user_records');
    const json = response.data;
    if (Array.isArray(json)) return json;
    if (json && Array.isArray(json.data)) return json.data;
    return [];
  } catch (error: unknown) {
    // 未ログインなどで 401 のときは空配列を返してページを表示させる
    // それ以外のエラーもとりあえず落とさず空配列にフォールバック
    console.error('Failed to fetch user counseling records', error);
    return [];
  }
});
