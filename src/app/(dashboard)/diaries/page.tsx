'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { createDiary } from '@/api/diaries';
import axios from 'axios';

const DiaryPage = () => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return alert('内容を入力してください');
    setIsSaving(true);
    try {
      await createDiary(content);
      alert('保存成功！');
      setContent('');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Save Error:', error.response?.data || error.message);
      }
      alert('保存に失敗しました。Railsサーバーを確認してください。');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>日報・ノート</h1>
        <p className={styles.subtitle}>今日の積み上げや、誰にも言えない本音をここに。</p>
      </header>

      <section className={styles.editorSection}>
        <textarea
          className={styles.textarea}
          placeholder="今日はどんな一日でしたか？"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
        />
        <div className={styles.footer}>
          <span className={styles.charCount}>{content.length} / 1000文字</span>
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
    </div>
  );
};

export default DiaryPage;
