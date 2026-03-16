import useSWR from 'swr';
import {
  getPhq9Assessments,
  createPhq9Assessment,
  getResilienceHistory,
  createResilienceAssessment,
  getCognitiveDistortionHistory,
  createCognitiveDistortionAssessment,
} from '@/api/assessments';

// --- PHQ-9 用フック ---

export const usePhq9 = () => {
  const { data, error, isLoading } = useSWR('/phq9_assessments', getPhq9Assessments,{
      revalidateOnMount: false,     // ★ ページを開いた時の自動GETをオフにする
      revalidateOnFocus: false,     // ★ ウィンドウにフォーカスした時のGETもオフにする
      revalidateIfStale: false,     // ★ キャッシュが古くても勝手に取らない
    });

  // データの加工ロジックをフック内に移管
  const processedHistory = data
    ? (() => {
        const dailyLatestMap: Record<string, { date: string; score: number }> = {};
        data.forEach((item: any) => {
          dailyLatestMap[item.date] = {
            date: item.date,
            score: item.score,
          };
        });

        return Object.values(dailyLatestMap).sort((a, b) => a.date.localeCompare(b.date));
      })()
    : [];

  const create = async (formData: any) => {
    const result = await createPhq9Assessment(formData);
    return result;
  };

  return {
    history: processedHistory, // 加工済みのデータを返す
    rawItems: data, // 必要なら生データも返せる
    isLoading,
    isError: error,
    create,
  };
};

// --- レジリエンス用フック ---
export const useResilience = () => {
  const { data, error, isLoading } = useSWR(
    '/resilience_assessments',
    getResilienceHistory,{
      revalidateOnMount: false,     // ★ ページを開いた時の自動GETをオフにする
      revalidateOnFocus: false,     // ★ ウィンドウにフォーカスした時のGETもオフにする
      revalidateIfStale: false,     // ★ キャッシュが古くても勝手に取らない
    }
  );

  // 最新の1件を抽出するロジックをフック側に持たせる
  const latestData = data && data.length > 0 ? data[data.length - 1] : null;

  const create = async (formData: any) => {
    const result = await createResilienceAssessment(formData);
    return result;
  };

  return {
    history: data,
    latestData, // ページ側で使う最新データ
    isLoading,
    isError: error,
    create, // フォーム側で使う保存関数
  };
};

// --- 認知の歪み用フック ---
export const useCognitiveDistortion = () => {
  const { data, error, isLoading } = useSWR(
    '/cognitive_distortion_assessments',
    getCognitiveDistortionHistory,{
      revalidateOnMount: false,     // ★ ページを開いた時の自動GETをオフにする
      revalidateOnFocus: false,     // ★ ウィンドウにフォーカスした時のGETもオフにする
      revalidateIfStale: false,     // ★ キャッシュが古くても勝手に取らない
    }
  );

  const latestResult = data && data.length > 0 ? data[data.length - 1] : null;

  const create = async (formData: any) => {
    const result = await createCognitiveDistortionAssessment(formData);
    return result;
  };

  return {
    history: data,
    latestResult,
    isLoading,
    isError: error,
    create,
  };
};
