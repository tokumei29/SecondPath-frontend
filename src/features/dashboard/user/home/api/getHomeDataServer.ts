import { cache } from 'react';
import apiClient from '@/api/client';

const ensureThreeFields = (arr: string[] | null | undefined) => {
  const newArr = arr ? [...arr] : [];
  while (newArr.length < 3) newArr.push('');
  return newArr.slice(0, 3);
};

export const getHomeDataServer = cache(async () => {
  try {
    const [profileRes, diariesRes, supportsRes, recordsRes] = await Promise.all([
      apiClient.get('/profile'),
      apiClient.get('/diaries'),
      apiClient.get('/text_supports'),
      apiClient.get('/user_records'),
    ]);

    const profileJson = profileRes.data;
    const diariesJson = diariesRes.data;
    const supportsJson = supportsRes.data;
    const recordsJson = recordsRes.data;

    const profile = profileJson
      ? {
          ...profileJson,
          strengths: ensureThreeFields(profileJson.strengths),
          weaknesses: ensureThreeFields(profileJson.weaknesses),
          likes: ensureThreeFields(profileJson.likes),
          hobbies: ensureThreeFields(profileJson.hobbies),
          short_term_goals: ensureThreeFields(profileJson.short_term_goals),
          long_term_goals: ensureThreeFields(profileJson.long_term_goals),
        }
      : null;

    const diaries = Array.isArray(diariesJson)
      ? diariesJson
      : diariesJson?.data && Array.isArray(diariesJson.data)
        ? diariesJson.data
        : [];

    const supports = Array.isArray(supportsJson)
      ? supportsJson
      : supportsJson?.data && Array.isArray(supportsJson.data)
        ? supportsJson.data
        : [];

    const records = Array.isArray(recordsJson)
      ? recordsJson
      : recordsJson?.data && Array.isArray(recordsJson.data)
        ? recordsJson.data
        : [];

    const todayStr = new Date().toLocaleDateString('sv-SE');
    const hasTodayAdvice = records.some(
      (record: any) => record.date && record.date.includes(todayStr)
    );

    return { profile, diaries, supports, hasTodayAdvice };
  } catch (error: unknown) {
    // 未ログインなどで 401 の場合も含め、ホーム画面自体は表示させたいので
    console.error('Failed to fetch home data', error);
    return {
      profile: null,
      diaries: [],
      supports: [],
      hasTodayAdvice: false,
    };
  }
});
