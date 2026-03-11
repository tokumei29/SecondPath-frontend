'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDiaries } from '@/api/diaries';
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

  useEffect(() => {
    const fetchAllDiaries = async () => {
      try {
        const res = await getDiaries(userId);
        setDiaries(res.data); // sliceせず全部入れる
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllDiaries();
  }, [userId]);

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
                <td>
                  <button onClick={() => setSelectedDiary(diary)} className={styles.viewBtn}>
                    詳細
                  </button>
                  <button
                    className={styles.editBtn}
                    onClick={() => router.push(`/${userId}/diaries/${diary.id}/edit`)}
                  >
                    編集
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
