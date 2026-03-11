export type ProfileArrayKeys =
  | 'strengths'
  | 'weaknesses'
  | 'likes'
  | 'hobbies'
  | 'short_term_goals'
  | 'long_term_goals';

export type Profile = {
  name: string;
} & Record<ProfileArrayKeys, string[]>;

export type ProfileResponse = Profile & {
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
};
