'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { getDiary, updateDiary, type DiaryPayload } from '@/api/diaries';
import styles from '@/app/(dashboard)/(user)/diaries/page.module.css';
import { DiaryField } from '@/features/components/diaries/diaryField';

const DiaryEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const diaryId = params?.diaryId as string;

  const [formData, setFormData] = useState({
    content: '',
    good_thing: '',
    improvement: '',
    tomorrow_goal: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 【最重要】初期レンダリング時にデータを取得してフォームに入れる
  useEffect(() => {
    const fetchDiary = async () => {
      if (!diaryId) return;
      try {
        const res = await getDiary(diaryId);
        // APIから返ってきたデータをstateにセットすることで、入力欄に値が入る
        const d = res.data;
        setFormData({
          content: d.content || '',
          good_thing: d.good_thing || '',
          improvement: d.improvement || '',
          tomorrow_goal: d.tomorrow_goal || '',
        });
      } catch (error) {
        console.error('Failed to fetch diary:', error);
        alert('データの取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDiary();
  }, [diaryId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
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

      // payload をそのまま渡す
      await updateDiary(diaryId, payload);
      alert('更新しました！');
      router.push('/diaries/history'); // 保存後は履歴などへ遷移
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Update Error:', error.response?.data);
      }
      alert('更新に失敗しました。');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>記録を編集</h1>
        <p className={styles.subtitle}>過去の積み上げをブラッシュアップしましょう。</p>
      </header>

      <section className={styles.editorSection}>
        <DiaryField
          label="今日の内容"
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
            onClick={handleUpdate}
            disabled={isSaving}
          >
            {isSaving ? '更新中...' : '変更を保存する'}
          </button>
          <button type="button" className={styles.cancelButton} onClick={() => router.back()}>
            キャンセル
          </button>
        </div>
      </section>
    </div>
  );
};

export default DiaryEditPage;
