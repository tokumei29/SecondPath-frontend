import { cache } from 'react';
import { serverFetchJson } from '@/api/serverFetch';
import { Profile } from '@/features/types/profile';

const ensureThreeFields = (arr: string[] | null | undefined) => {
  const newArr = arr ? [...arr] : [];
  while (newArr.length < 3) newArr.push('');
  return newArr.slice(0, 3);
};

export const getProfileServer = cache(async (): Promise<Profile | null> => {
  const res = await serverFetchJson<any>('/profile', { revalidateSeconds: 600 });
  if (!res) return null;
  return {
    ...res,
    strengths: ensureThreeFields(res.strengths),
    weaknesses: ensureThreeFields(res.weaknesses),
    likes: ensureThreeFields(res.likes),
    hobbies: ensureThreeFields(res.hobbies),
    short_term_goals: ensureThreeFields(res.short_term_goals),
    long_term_goals: ensureThreeFields(res.long_term_goals),
  };
});
