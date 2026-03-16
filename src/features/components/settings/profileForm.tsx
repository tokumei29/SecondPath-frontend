'use client';

import { InputGroup } from '@/features/components/inputGroup/inputGroup';
import { Profile, ProfileArrayKeys } from '@/features/types/profile';
import styles from './ProfileForm.module.css';

type ProfileFormProps = {
  localProfile: Profile;
  onNameChange: (value: string) => void;
  onArrayChange: <K extends ProfileArrayKeys>(key: K, index: number, value: string) => void;
};

export const ProfileForm = ({ localProfile, onNameChange, onArrayChange }: ProfileFormProps) => {
  return (
    <>
      <div className={styles.section}>
        <label className={styles.label}>あなたの名前</label>
        <input
          type="text"
          required
          maxLength={50}
          className={styles.input}
          value={localProfile.name || ''}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="カウンセリング時の名前を入力"
        />
      </div>

      <p className={styles.subtitle}>「今の自分」を3つずつ言語化してください。</p>

      <InputGroup
        title="自分の強み"
        values={localProfile.strengths}
        onFieldChange={(i, v) => onArrayChange('strengths', i, v)}
      />
      <InputGroup
        title="克服したいこと"
        values={localProfile.weaknesses}
        onFieldChange={(i, v) => onArrayChange('weaknesses', i, v)}
      />
      <InputGroup
        title="好きなこと・もの"
        values={localProfile.likes}
        onFieldChange={(i, v) => onArrayChange('likes', i, v)}
      />
      <InputGroup
        title="趣味"
        values={localProfile.hobbies}
        onFieldChange={(i, v) => onArrayChange('hobbies', i, v)}
      />
      <InputGroup
        title="直近の短期目標"
        values={localProfile.short_term_goals}
        onFieldChange={(i, v) => onArrayChange('short_term_goals', i, v)}
      />
      <InputGroup
        title="長期の成し遂げたいこと"
        values={localProfile.long_term_goals}
        onFieldChange={(i, v) => onArrayChange('long_term_goals', i, v)}
      />
    </>
  );
};
