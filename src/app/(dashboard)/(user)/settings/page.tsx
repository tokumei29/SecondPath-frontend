'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getProfile, updateProfile } from '@/api/profile';
import { SuccessModal } from '@/features/components/home/SuccessModal';
import { InputGroup } from '@/features/components/inputGroup/inputGroup';
import { Profile, ProfileArrayKeys } from '@/features/types/profile';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import styles from './page.module.css';

/**
 * 設定メインページ (全項目対応版)
 */
const SettingsPage = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  useBodyScrollLock(showSuccessModal);

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
      try {
        const data = await getProfile();

        // ヘルパー関数: 配列が空、または要素が足りない場合に3つ分を保証する
        const ensureThreeFields = (arr: string[] | null) => {
          if (!arr || arr.length === 0) return ['', '', ''];
          // 要素が1つや2つの場合も考慮するなら
          const newArr = [...arr];
          while (newArr.length < 3) newArr.push('');
          return newArr;
        };

        setProfile({
          name: data.name || '',
          strengths: ensureThreeFields(data.strengths),
          weaknesses: ensureThreeFields(data.weaknesses),
          likes: ensureThreeFields(data.likes),
          hobbies: ensureThreeFields(data.hobbies),
          short_term_goals: ensureThreeFields(data.short_term_goals),
          long_term_goals: ensureThreeFields(data.long_term_goals),
        });
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
      await updateProfile(profile);
      setShowSuccessModal(true);
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
      </header>

      <div className={styles.section}>
        <label className={styles.label}>あなたの名前</label>
        <input
          type="text"
          required
          maxLength={50}
          className={styles.input}
          value={profile.name || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProfile({ ...profile, name: e.target.value })
          }
          placeholder="カウンセリング時の名前を入力（初期設定では名前のみを入力必須としています。）"
        />
      </div>

      <p className={styles.subtitle}>「今の自分」を3つずつ言語化してください。</p>
      <p>
        自分の長所、克服したいところ、目標を言語化します。その上で日報を日々書いて自分を振り返りながら一歩ずつ問題を克服していきましょう。
      </p>
      {/* 1. 強み */}
      <InputGroup
        title="自分の強み"
        values={profile.strengths}
        onFieldChange={(i, v) => handleArrayChange('strengths', i, v)}
      />

      {/* 2. 弱み */}
      <InputGroup
        title="克服したいこと"
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
        title="直近の成し遂げたいこと（短期目標）"
        values={profile.short_term_goals}
        onFieldChange={(i, v) => handleArrayChange('short_term_goals', i, v)}
      />

      {/* 6. 長期目標 */}
      <InputGroup
        title="長期の成し遂げたいこと（長期目標）"
        values={profile.long_term_goals}
        onFieldChange={(i, v) => handleArrayChange('long_term_goals', i, v)}
      />

      <div className={styles.footer}>
        <button className={styles.saveButton} disabled={isSaving} onClick={handleSave}>
          設定を保存する
        </button>
      </div>
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="自己分析、お疲れ様でした！"
        message={`${profile.name}さん、自分自身を言葉にするという大きな一歩を踏み出しましたね。この言語化が、あなたの未来を切り拓く武器になります！\n日々見直し明日への行動指針にしましょう！`}
      />
    </div>
  );
};

export default SettingsPage;
