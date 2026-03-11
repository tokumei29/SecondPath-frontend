'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './page.module.css';
import { getProfile, updateProfile } from '@/api/profile';
import { InputGroup } from '@/features/profile/components/inputGroup/inputGroup';
import { Profile, ProfileArrayKeys } from '@/types/profile';
import axios from 'axios';

/**
 * 設定メインページ
 */
const SettingsPage = () => {
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

  // 初回データ取得：重複していたuseEffectを一本化
  useEffect(() => {
    const init = async () => {
      try {
        const data = await getProfile();
        // サーバーから空配列や不完全なデータが来ても壊れないようにマージ
        setProfile((prev) => ({ ...prev, ...data }));
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  /**
   * 型安全な配列更新
   * ジェネリクス K を使用して、特定のキーに対応する string[] を確実に操作
   */
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
      await updateProfile(profile);
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
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>自己分析設定</h1>
        <p className={styles.subtitle}>「今の自分」を3つずつ言語化してください。</p>
      </header>

      <div className={styles.section}>
        <label className={styles.label}>あなたの名前</label>
        <input
          type="text"
          className={styles.input}
          value={profile.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProfile({ ...profile, name: e.target.value })
          }
          placeholder="名前を入力"
        />
      </div>

      <InputGroup
        title="自分の強み"
        values={profile.strengths}
        onFieldChange={(i, v) => handleArrayChange('strengths', i, v)}
      />

      <InputGroup
        title="克服したいこと（弱み）"
        values={profile.weaknesses}
        onFieldChange={(i, v) => handleArrayChange('weaknesses', i, v)}
      />

      <InputGroup
        title="好きなこと・もの"
        values={profile.likes}
        onFieldChange={(i, v) => handleArrayChange('likes', i, v)}
      />

      <InputGroup
        title="趣味"
        values={profile.hobbies}
        onFieldChange={(i, v) => handleArrayChange('hobbies', i, v)}
      />

      <InputGroup
        title="直近の成し遂げたいこと"
        values={profile.short_term_goals}
        onFieldChange={(i, v) => handleArrayChange('short_term_goals', i, v)}
      />

      <InputGroup
        title="長期の成し遂げたいこと"
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

export default SettingsPage;
