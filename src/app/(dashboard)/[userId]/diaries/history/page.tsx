'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { deleteDiary, getDiaries } from '@/api/diaries';
import { DiaryDetailModal } from '@/features/components/diaries/modal';
import styles from './page.module.css';
import type { Diary } from '../../home/page';

const HistoryPage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllDiaries = async () => {
    try {
      const res = await getDiaries(userId);
      setDiaries(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDiaries();
  }, [userId]);

  // 削除処理
  const handleDelete = async (diaryId: number) => {
    if (!window.confirm('この記録を削除してもよろしいですか？\n削除したデータは元に戻せません。')) {
      return;
    }

    try {
      await deleteDiary(userId, String(diaryId));
      alert('削除しました。');
      // 削除に成功したら一覧を更新
      fetchAllDiaries();
    } catch (error) {
      console.error('削除失敗:', error);
      alert('削除に失敗しました。');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
            {diaries.map((diary) => (
              <tr key={diary.id}>
                <td>{new Date(diary.created_at).toLocaleDateString()}</td>
                <td>{diary.content.substring(0, 50)}...</td>
                <td className={styles.actions}>
                  <button onClick={() => setSelectedDiary(diary)} className={styles.viewBtn}>
                    詳細を見る
                  </button>
                  <button
                    className={styles.editBtn}
                    onClick={() => router.push(`/${userId}/diaries/${diary.id}/edit`)}
                  >
                    編集
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(diary.id)}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DiaryDetailModal diary={selectedDiary} onClose={() => setSelectedDiary(null)} />
    </div>
  );
};

export default HistoryPage;
