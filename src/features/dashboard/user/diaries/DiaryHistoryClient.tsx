'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteDiary } from '@/features/dashboard/user/diaries/api/diariesClient';
import { DiaryDetailModal } from '@/features/dashboard/user/diaries/components/DiaryDetailModal';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import styles from './DiaryHistoryPage.module.css';

type Props = {
  initialDiaries: any[];
};

export function DiaryHistoryClient({ initialDiaries }: Props) {
  const router = useRouter();
  const [selectedDiary, setSelectedDiary] = useState<any>(null);

  const [diaries, setDiaries] = useState<any[]>(initialDiaries ?? []);
  const [isLoading, setIsLoading] = useState(!initialDiaries || initialDiaries.length === 0);

  useBodyScrollLock(!!selectedDiary);

  const handleDelete = async (diaryId: string) => {
    if (!window.confirm('この記録を削除してもよろしいですか？\n削除したデータは元に戻せません。')) {
      return;
    }

    try {
      await deleteDiary(diaryId);
      setDiaries((prev) => prev.filter((d) => String(d.id) !== String(diaryId)));
      setIsLoading(false);
      alert('削除しました。');
    } catch (error) {
      console.error('削除失敗:', error);
      alert('削除に失敗しました。');
    }
  };

  if (isLoading) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>📚 過去の記録一覧</h1>
        <p>これまでの積み上げをすべて振り返ることができます。</p>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>日付</th>
              <th>内容プレビュー</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {diaries && diaries.length > 0 ? (
              diaries.map((diary: any) => (
                <tr key={diary.id}>
                  <td>{new Date(diary.created_at).toLocaleDateString()}</td>
                  <td>{diary.content.substring(0, 50)}...</td>
                  <td className={styles.actions}>
                    <button onClick={() => setSelectedDiary(diary)} className={styles.viewBtn}>
                      日報を見る
                    </button>
                    <button
                      className={styles.editBtn}
                      onClick={() => router.push(`/diaries/${diary.id}/edit`)}
                    >
                      編集
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(diary.id)}>
                      削除
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>
                  記録がまだありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DiaryDetailModal diary={selectedDiary} onClose={() => setSelectedDiary(null)} />
    </div>
  );
}
