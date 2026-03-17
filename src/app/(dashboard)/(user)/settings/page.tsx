'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProfile, updateProfile } from '@/api/profile';
import { SuccessModal } from '@/features/components/home/SuccessModal';
import { ProfileForm } from '@/features/components/settings/profileForm';
import { Profile, ProfileArrayKeys } from '@/features/types/profile';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import styles from './page.module.css';

const ensureThreeFields = (arr: string[] | null | undefined) => {
  const newArr = arr ? [...arr] : [];
  while (newArr.length < 3) newArr.push('');
  return newArr.slice(0, 3);
};

const SettingsPage = () => {
  const [serverProfile, setServerProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [localProfile, setLocalProfile] = useState<Profile | null>(null);

  useBodyScrollLock(showSuccessModal);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await getProfile();
        const normalized = res
          ? {
              ...res,
              strengths: ensureThreeFields(res.strengths),
              weaknesses: ensureThreeFields(res.weaknesses),
              likes: ensureThreeFields(res.likes),
              hobbies: ensureThreeFields(res.hobbies),
              short_term_goals: ensureThreeFields(res.short_term_goals),
              long_term_goals: ensureThreeFields(res.long_term_goals),
            }
          : null;
        setServerProfile(normalized);
      } catch (e) {
        console.error(e);
        setServerProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
      const updated = await updateProfile(localProfile);
      const normalized = updated
        ? {
            ...updated,
            strengths: ensureThreeFields(updated.strengths),
            weaknesses: ensureThreeFields(updated.weaknesses),
            likes: ensureThreeFields(updated.likes),
            hobbies: ensureThreeFields(updated.hobbies),
            short_term_goals: ensureThreeFields(updated.short_term_goals),
            long_term_goals: ensureThreeFields(updated.long_term_goals),
          }
        : null;
      setServerProfile(normalized);
      setLocalProfile(normalized);
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
