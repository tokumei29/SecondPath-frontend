import { cache } from 'react';
import apiClient from '@/api/client';

export const getTextSupportDetailServer = cache(async (id: string) => {
  try {
    const response = await apiClient.get(`/text_supports/${id}`);
    const json = response.data;

    // Railsが show で render json: @text_support と直接返しているなら
    // そのまま json を返せばOK。
    // json.data が undefined の場合に備えて安全に書く。
    if (!json) return null;
    return json.data || json;
  } catch (error) {
    console.error('個別データの取得に失敗:', error);
    return null;
  }
});
