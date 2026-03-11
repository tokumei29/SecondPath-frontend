'use client';

import styles from './modal.module.css';

type Diary = {
  id: number;
  content: string;
  good_thing: string;
  improvement: string;
  tomorrow_goal: string;
  created_at: string;
};

type Props = {
  diary: Diary | null;
  onClose: () => void;
};

export const DiaryDetailModal = ({ diary, onClose }: Props) => {
  if (!diary) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>{formatDate(diary.created_at)} の振り返り</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </header>

        <div className={styles.scrollArea}>
          {/* 1. 今日の内容 */}
          <section className={styles.section}>
            <label className={styles.label}>今日の内容</label>
            <p className={styles.text}>{diary.content}</p>
          </section>

          {/* 2. 良かったこと */}
          {diary.good_thing && (
            <section className={styles.section}>
              <label className={styles.label}>✨ 今日の良かったこと</label>
              <p className={styles.text}>{diary.good_thing}</p>
            </section>
          )}

          {/* 3. 反省点 */}
          {diary.improvement && (
            <section className={styles.section}>
              <label className={styles.label}>🤔 今日の反省点</label>
              <p className={styles.text}>{diary.improvement}</p>
            </section>
          )}

          {/* 4. 明日の目標 */}
          {diary.tomorrow_goal && (
            <section className={styles.section}>
              <label className={styles.label}>🚀 明日の目標</label>
              <p className={styles.text}>{diary.tomorrow_goal}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
