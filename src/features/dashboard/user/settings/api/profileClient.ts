import apiClient from '@/api/client';
import type { Profile } from '@/features/types/profile';

export const getProfile = async () => {
  const response = await apiClient.get('/profile');
  return response.data;
};

/** GET で返る id / user_id / timestamps は送らない（Rails が 422 や不正更新になることがある） */
function profilePatchPayload(profile: Partial<Profile>): Record<string, unknown> {
  const keys: Array<keyof Profile | 'has_seen_guide'> = [
    'name',
    'has_seen_guide',
    'strengths',
    'weaknesses',
    'likes',
    'hobbies',
    'short_term_goals',
    'long_term_goals',
  ];
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in profile && profile[key as keyof Profile] !== undefined) {
      out[key] = profile[key as keyof Profile];
    }
  }
  return out;
}

export const updateProfile = async (profile: Partial<Profile>) => {
  const response = await apiClient.patch('/profile', {
    profile: profilePatchPayload(profile),
  });
  return response.data;
};
