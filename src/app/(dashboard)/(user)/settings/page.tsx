'use client';

import { useState, useEffect, useCallback } from 'react';
import { SuccessModal } from '@/features/components/home/SuccessModal';
import { ProfileForm } from '@/features/components/settings/profileForm';
import { Profile, ProfileArrayKeys } from '@/features/types/profile';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useProfile, useUpdateProfile } from '@/services/useProfile';
import styles from './page.module.css';

const SettingsPage = () => {
  const { profile: serverProfile, isLoading } = useProfile();
  const { update } = useUpdateProfile();

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [localProfile, setLocalProfile] = useState<Profile | null>(null);

  useBodyScrollLock(showSuccessModal);

  useEffect(() => {
    if (serverProfile && !localProfile) setLocalProfile(serverProfile);
  }, [serverProfile, localProfile]);

  const handleArrayChange = useCallback(
    <K extends ProfileArrayKeys>(key: K, index: number, value: string) => {
      setLocalProfile((prev) => {
        if (!prev) return prev;
        return { ...prev, [key]: prev[key].map((item, i) => (i === index ? value : item)) };
      });
    },
    []
  );

  const handleNameChange = useCallback((value: string) => {
    setLocalProfile((prev) => (prev ? { ...prev, name: value } : null));
  }, []);

  const handleSave = async () => {
    if (!localProfile) return;
    try {
      setIsSaving(true);
      await update(localProfile);
      setShowSuccessModal(true);
    } catch (error) {
      alert('保存に失敗しました。');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !localProfile) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>自己分析設定</h1>
      </header>

      {/* フォーム部分をコンポーネント化 */}
      <ProfileForm
        localProfile={localProfile}
        onNameChange={handleNameChange}
        onArrayChange={handleArrayChange}
      />

      <div className={styles.footer}>
        <button className={styles.saveButton} disabled={isSaving} onClick={handleSave}>
          {isSaving ? '保存中...' : '設定を保存する'}
        </button>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="自己分析、お疲れ様でした！"
        message={`${localProfile.name}さんの未来を切り拓く武器になります！`}
      />
    </div>
  );
};

export default SettingsPage;
