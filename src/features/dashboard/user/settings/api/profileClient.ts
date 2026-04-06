import axios from 'axios';
import apiClient from '@/api/client';
import type { Profile } from '@/features/types/profile';

function formatResponseBody(data: unknown): string {
  if (data === undefined || data === null) return String(data);
  if (typeof data === 'string') return data;
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

export const getProfile = async () => {
  const response = await apiClient.get('/profile');
  return response.data;
};

/**
 * GET で返る id / user_id / timestamps を送ると、Rails 側で user_id の uniqueness などが走り
 * "User has already been taken" 系の 422 になることがある。
 */
function profilePatchPayload(profile: Partial<Profile>): Record<string, unknown> {
  const keys = [
    'name',
    'has_seen_guide',
    'strengths',
    'weaknesses',
    'likes',
    'hobbies',
    'short_term_goals',
    'long_term_goals',
  ] as const;
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in profile && profile[key] !== undefined) {
      out[key] = profile[key];
    }
  }
  return out;
}

export const updateProfile = async (profile: Partial<Profile>) => {
  try {
    const response = await apiClient.patch('/profile', {
      profile: profilePatchPayload(profile),
    });
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const body = formatResponseBody(err.response?.data);
      console.log('[updateProfile] PATCH /profile failed', `status=${status}`);
      console.log('[updateProfile] response body (raw):\n', body);
    } else {
      console.log('[updateProfile] PATCH /profile failed', err);
    }
    throw err;
  }
};
