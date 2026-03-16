'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { SuccessModal } from '@/features/components/home/SuccessModal';
import { InputGroup } from '@/features/components/inputGroup/inputGroup';
import { Profile, ProfileArrayKeys } from '@/features/types/profile';
import { useBodyScrollLock } from '@/services/useBodyScrollLock';
import { useProfile } from '@/services/useProfile';
import styles from './page.module.css';

const SettingsPage = () => {
  const { profile: serverProfile, isLoading, update } = useProfile();

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // 入力中の一時的な状態を管理
  const [localProfile, setLocalProfile] = useState<Profile | null>(null);

  useBodyScrollLock(showSuccessModal);

  // サーバーからデータが届いたら、ローカルの入力用 state にコピー
  useEffect(() => {
    if (serverProfile && !localProfile) {
      setLocalProfile(serverProfile);
    }
  }, [serverProfile, localProfile]);

  const handleArrayChange = useCallback(
    <K extends ProfileArrayKeys>(key: K, index: number, value: string) => {
      setLocalProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [key]: prev[key].map((item, i) => (i === index ? value : item)),
        };
      });
    },
    []
  );

  const handleSave = async () => {
    if (!localProfile) return;
    try {
      setIsSaving(true);
      await update(localProfile); // SWRフック経由で更新
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

  // 読み込み中、またはデータの同期待ち
  if (isLoading || !localProfile) return <div className={styles.loading}>読み込み中...</div>;

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
          value={localProfile.name || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLocalProfile({ ...localProfile, name: e.target.value })
          }
          placeholder="カウンセリング時の名前を入力（初期設定では名前のみを入力必須としています。）"
        />
      </div>

      <p className={styles.subtitle}>「今の自分」を3つずつ言語化してください。</p>
      <p>
        自分の長所、克服したいところ、目標を言語化します。その上で日報を日々書いて自分を振り返りながら一歩ずつ問題を克服していきましょう。
      </p>

      <InputGroup
        title="自分の強み"
        values={localProfile.strengths}
        onFieldChange={(i, v) => handleArrayChange('strengths', i, v)}
      />

      <InputGroup
        title="克服したいこと"
        values={localProfile.weaknesses}
        onFieldChange={(i, v) => handleArrayChange('weaknesses', i, v)}
      />

      <InputGroup
        title="好きなこと・もの"
        values={localProfile.likes}
        onFieldChange={(i, v) => handleArrayChange('likes', i, v)}
      />

      <InputGroup
        title="趣味"
        values={localProfile.hobbies}
        onFieldChange={(i, v) => handleArrayChange('hobbies', i, v)}
      />

      <InputGroup
        title="直近の成し遂げたいこと（短期目標）"
        values={localProfile.short_term_goals}
        onFieldChange={(i, v) => handleArrayChange('short_term_goals', i, v)}
      />

      <InputGroup
        title="長期の成し遂げたいこと（長期目標）"
        values={localProfile.long_term_goals}
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
        message={`${localProfile.name}さん、自分自身を言葉にするという大きな一歩を踏み出しましたね。この言語化が、あなたの未来を切り拓く武器になります！\n日々見直し明日への行動指針にしましょう！`}
      />
    </div>
  );
};

export default SettingsPage;
