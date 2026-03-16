import useSWR from 'swr';
import { getProfile, updateProfile } from '@/api/profile';
import { Profile } from '@/features/types/profile';

export const useProfile = () => {
  const { data, error, mutate, isLoading } = useSWR<Profile>('/profile', getProfile);

  // ヘルパー: 配列を常に3要素にする
  const ensureThreeFields = (arr: string[] | null | undefined) => {
    const newArr = arr ? [...arr] : [];
    while (newArr.length < 3) newArr.push('');
    return newArr.slice(0, 3);
  };

  // 加工済みプロフィールデータ
  const profile = data
    ? {
        ...data,
        strengths: ensureThreeFields(data.strengths),
        weaknesses: ensureThreeFields(data.weaknesses),
        likes: ensureThreeFields(data.likes),
        hobbies: ensureThreeFields(data.hobbies),
        short_term_goals: ensureThreeFields(data.short_term_goals),
        long_term_goals: ensureThreeFields(data.long_term_goals),
      }
    : null;

  const update = async (profileData: Profile) => {
    const updated = await updateProfile(profileData);
    // 更新後、キャッシュを即座に書き換え
    await mutate(updated, true);
    return updated;
  };

  return {
    profile,
    isLoading,
    isError: error,
    update,
  };
};
