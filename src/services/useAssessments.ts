import useSWR from 'swr';
import {
  getPhq9Assessments,
  createPhq9Assessment,
  getResilienceHistory,
  createResilienceAssessment,
  getCognitiveDistortionHistory,
  createCognitiveDistortionAssessment,
} from '@/api/assessments';

// ==========================================
// 1. PHQ-9
// ==========================================

/** 【表示用】履歴を取得・加工する */
export const usePhq9History = () => {
  const { data, error, isLoading, mutate } = useSWR('/phq9_assessments', getPhq9Assessments);

  const processedHistory = data
    ? (() => {
        const dailyLatestMap: Record<string, { date: string; score: number }> = {};
        data.forEach((item: any) => {
          dailyLatestMap[item.date] = { date: item.date, score: item.score };
        });
        return Object.values(dailyLatestMap).sort((a, b) => a.date.localeCompare(b.date));
      })()
    : [];

  return { history: processedHistory, isLoading, isError: error, mutate };
};

/** 【作成用】保存するだけ（通信は走らない） */
export const useCreatePhq9 = () => {
  const create = async (formData: any) => await createPhq9Assessment(formData);
  return { create };
};

// ==========================================
// 2. レジリエンス
// ==========================================

/** 【表示用】 */
export const useResilienceHistory = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/resilience_assessments',
    getResilienceHistory
  );
  const latestData = data && data.length > 0 ? data[data.length - 1] : null;

  return { history: data, latestData, isLoading, isError: error, mutate };
};

/** 【作成用】 */
export const useCreateResilience = () => {
  const create = async (formData: any) => await createResilienceAssessment(formData);
  return { create };
};

// ==========================================
// 3. 認知の歪み
// ==========================================

/** 【表示用】 */
export const useCognitiveDistortionHistory = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/cognitive_distortion_assessments',
    getCognitiveDistortionHistory
  );
  const latestResult = data && data.length > 0 ? data[data.length - 1] : null;

  return { history: data, latestResult, isLoading, isError: error, mutate };
};

/** 【作成用】 */
export const useCreateCognitiveDistortion = () => {
  const create = async (formData: any) => await createCognitiveDistortionAssessment(formData);
  return { create };
};
