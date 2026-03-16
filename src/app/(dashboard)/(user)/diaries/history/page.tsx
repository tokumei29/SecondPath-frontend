'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DiaryDetailModal } from '@/features/components/diaries/modal';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useDiaries, useDiary } from '@/services/useDiaries';
import styles from './page.module.css';

const HistoryPage = () => {
  const router = useRouter();
  const [selectedDiary, setSelectedDiary] = useState<any>(null);

  // SWRフックからデータと機能を抽出
  const { diaries, isLoading } = useDiaries();
  const { remove } = useDiary();

  useBodyScrollLock(!!selectedDiary);

  const handleDelete = async (diaryId: string) => {
    if (!window.confirm('この記録を削除してもよろしいですか？\n削除したデータは元に戻せません。')) {
      return;
    }

    try {
      // 改造した remove 関数に ID を渡すだけ！
      // 内部で globalMutate が走るので、自動的に一覧から消えます
      await remove(diaryId);
      alert('削除しました。');
    } catch (error) {
      console.error('削除失敗:', error);
      alert('削除に失敗しました。');
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>読み込み中...</div>;
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
};

export default HistoryPage;
