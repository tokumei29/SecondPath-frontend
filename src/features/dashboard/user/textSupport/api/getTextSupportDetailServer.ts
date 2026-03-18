import { cache } from 'react';
import { serverFetchJson } from '@/api/serverFetch';

export const getTextSupportDetailServer = cache(async (id: string) => {
  try {
    const json = await serverFetchJson<any>(`/text_supports/${id}`);
    if (!json) return null;
    return json.data || json;
  } catch (error) {
    console.error('個別データの取得に失敗:', error);
    return null;
  }
});
