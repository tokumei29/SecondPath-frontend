'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { getProfile, updateProfile } from '@/api/profile';
import { InputGroup } from '@/features/components/inputGroup/inputGroup';
import { Profile, ProfileArrayKeys } from '@/features/types/profile';
import styles from './page.module.css';

/**
 * 設定メインページ (全項目対応版)
 */
const SettingsPage = () => {
  const [isSaving, setIsSaving] = useState(false);
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

  // 初回データ取得
  useEffect(() => {
    const init = async () => {
      if (!userId) return;
      try {
        const data = await getProfile(userId);
        // サーバーからのデータで状態を更新
        setProfile((prev) => ({ ...prev, ...data }));
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [userId]);

  /**
   * 型安全な配列更新
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
      setIsSaving(true);
      await updateProfile(userId, profile);
      alert('設定を保存しました。');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Save Error:', error.response?.data);
      }
      alert('保存に失敗しました。');
    } finally {
      setIsSaving(false);
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
          value={profile.name || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProfile({ ...profile, name: e.target.value })
          }
          placeholder="名前を入力"
        />
      </div>

      {/* 1. 強み */}
      <InputGroup
        title="自分の強み"
        values={profile.strengths}
        onFieldChange={(i, v) => handleArrayChange('strengths', i, v)}
      />

      {/* 2. 弱み */}
      <InputGroup
        title="克服したいこと（弱み）"
        values={profile.weaknesses}
        onFieldChange={(i, v) => handleArrayChange('weaknesses', i, v)}
      />

      {/* 3. 好き */}
      <InputGroup
        title="好きなこと・もの"
        values={profile.likes}
        onFieldChange={(i, v) => handleArrayChange('likes', i, v)}
      />

      {/* 4. 趣味 */}
      <InputGroup
        title="趣味"
        values={profile.hobbies}
        onFieldChange={(i, v) => handleArrayChange('hobbies', i, v)}
      />

      {/* 5. 短期目標 */}
      <InputGroup
        title="直近の成し遂げたいこと"
        values={profile.short_term_goals}
        onFieldChange={(i, v) => handleArrayChange('short_term_goals', i, v)}
      />

      {/* 6. 長期目標 */}
      <InputGroup
        title="長期の成し遂げたいこと"
        values={profile.long_term_goals}
        onFieldChange={(i, v) => handleArrayChange('long_term_goals', i, v)}
      />

      <div className={styles.footer}>
        <button className={styles.saveButton} disabled={isSaving} onClick={handleSave}>
          設定を保存する
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
