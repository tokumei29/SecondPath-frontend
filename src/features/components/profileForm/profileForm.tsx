'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { getProfile, updateProfile } from '@/api/profile';
import { Profile, ProfileArrayKeys } from '@/features/types/profile';
import styles from './ProfileForm.module.css';
import { InputGroup } from '../inputGroup/inputGroup';

export const ProfileForm = () => {
  const params = useParams();
  const userId = params?.userId as string;

  const [profile, setProfile] = useState<Profile>({
    name: '',
    strengths: ['', '', ''],
    weaknesses: ['', '', ''],
    likes: ['', '', ''],
    hobbies: ['', '', ''],
    short_term_goals: ['', '', ''],
    long_term_goals: ['', '', ''],
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await getProfile(userId);
        setProfile((prev) => ({ ...prev, ...data }));
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [userId]);

  const handleArrayChange = useCallback(
    <K extends ProfileArrayKeys>(key: K, index: number, value: string) => {
      setProfile((prev) => ({
        ...prev,
        [key]: prev[key].map((item, i) => (i === index ? value : item)),
      }));
    },
    []
  );

  const handleSave = async () => {
    try {
      await updateProfile(userId, profile);
      alert('設定を保存しました。');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Save Error:', error.response?.data);
      }
      alert('保存に失敗しました。');
    }
  };

  if (isLoading) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.formWrapper}>
      <div className={styles.section}>
        <label className={styles.label}>あなたの名前</label>
        <input
          type="text"
          className={styles.input}
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="名前を入力"
        />
      </div>

      <InputGroup
        title="自分の強み"
        values={profile.strengths}
        onFieldChange={(i, v) => handleArrayChange('strengths', i, v)}
      />
      <InputGroup
        title="克服したいこと"
        values={profile.weaknesses}
        onFieldChange={(i, v) => handleArrayChange('weaknesses', i, v)}
      />
      <InputGroup
        title="好きなこと"
        values={profile.likes}
        onFieldChange={(i, v) => handleArrayChange('likes', i, v)}
      />
      <InputGroup
        title="趣味"
        values={profile.hobbies}
        onFieldChange={(i, v) => handleArrayChange('hobbies', i, v)}
      />
      <InputGroup
        title="直近の目標"
        values={profile.short_term_goals}
        onFieldChange={(i, v) => handleArrayChange('short_term_goals', i, v)}
      />
      <InputGroup
        title="長期の目標"
        values={profile.long_term_goals}
        onFieldChange={(i, v) => handleArrayChange('long_term_goals', i, v)}
      />

      <div className={styles.footer}>
        <button className={styles.saveButton} onClick={handleSave}>
          設定を保存する
        </button>
      </div>
    </div>
  );
};
