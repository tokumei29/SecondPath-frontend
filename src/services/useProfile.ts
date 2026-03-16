import useSWR, { useSWRConfig } from 'swr'; // useSWRConfig を追加
import { getProfile, updateProfile } from '@/api/profile';
import { Profile } from '@/features/types/profile';

// --- ヘルパー: 配列を常に3要素にする (フックの外に配置) ---
const ensureThreeFields = (arr: string[] | null | undefined) => {
  const newArr = arr ? [...arr] : [];
  while (newArr.length < 3) newArr.push('');
  return newArr.slice(0, 3);
};

// ==========================================
// 1. 閲覧用フック (Query: GET担当)
// ==========================================
export const useProfile = () => {
  const { data, error, mutate, isLoading } = useSWR<Profile>('/profile', getProfile);

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

  return {
    profile,
    isLoading,
    isError: error,
    mutate,
  };
};

// ==========================================
// 2. 更新用フック (Command: PATCH/PUT担当)
// ==========================================
export const useUpdateProfile = () => {
  const { mutate: globalMutate } = useSWRConfig();

  const update = async (profileData: Profile) => {
    const updated = await updateProfile(profileData);

    // '/profile' キーを指定してキャッシュを更新
    await globalMutate('/profile', updated, true);
    return updated;
  };

  return { update };
};
