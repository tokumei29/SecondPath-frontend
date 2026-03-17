'use client';

import { useState } from 'react';
import { createDiary, type DiaryPayload } from '@/api/diaries';
import { DiaryField } from '@/features/components/diaries/diaryField';
import { SuccessModal } from '@/features/components/home/SuccessModal';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import styles from './page.module.css';

const DiaryPage = () => {
  const [formData, setFormData] = useState({
    content: '',
    good_thing: '',
    improvement: '',
    tomorrow_goal: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useBodyScrollLock(showSuccessModal);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.content.trim()) return alert('今日の内容を入力してください');

    setIsSaving(true);
    try {
      const payload: DiaryPayload = {
        diary: {
          content: formData.content,
          good_thing: formData.good_thing,
          improvement: formData.improvement,
          tomorrow_goal: formData.tomorrow_goal,
        },
      };

      await createDiary(payload);

      setShowSuccessModal(true);
      setFormData({ content: '', good_thing: '', improvement: '', tomorrow_goal: '' });
    } catch (error: any) {
      console.error('Save Error:', error);
      alert('保存に失敗しました。');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>日報・ノート</h1>
        <p className={styles.subtitle}>今日の積み上げを記録しましょう。</p>
      </header>

      <section className={styles.editorSection}>
        <DiaryField
          label="今日の内容（必須）"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="今日はどんな一日でしたか？"
          isMain
        />
        <DiaryField
          label="✨ 今日の良かったこと"
          name="good_thing"
          value={formData.good_thing}
          onChange={handleChange}
          placeholder="些細なことでもOK！"
        />
        <DiaryField
          label="🤔 今日の反省点"
          name="improvement"
          value={formData.improvement}
          onChange={handleChange}
          placeholder="次はどうしたい？"
        />
        <DiaryField
          label="🚀 明日の目標"
          name="tomorrow_goal"
          value={formData.tomorrow_goal}
          onChange={handleChange}
          placeholder="これだけはやるぞ！"
        />

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? '保存中...' : '記録を保存'}
          </button>
        </div>
      </section>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="ご苦労様でした！"
        message={`今日という日を振り返り、言語化した自分を誇ってください！\n\n一歩一歩の記録が、未来のあなたを強く支える財産になります。\n明日の自分にバトンを繋げましたね！`}
      />
    </div>
  );
};

export default DiaryPage;
