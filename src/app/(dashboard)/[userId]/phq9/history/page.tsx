'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPhq9Assessments } from '@/api/assessments';
import { PHQ9HistoryChart } from '@/features/components/assessment/PHQ9HistoryChart';
import styles from './page.module.css';

type HistoryData = {
  date: string;
  score: number;
};

export default function AssessmentHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;

  const [history, setHistory] = useState<HistoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;
      try {
        const data = await getPhq9Assessments(userId);
        setHistory(data);
      } catch (error) {
        console.error('Failed to fetch assessment history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);

  if (isLoading) return <div className={styles.loading}>履歴を読み込み中...</div>;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>回復の軌跡</h1>
        <p className={styles.subtitle}>
          これまでのアセスメント結果の推移です。点数の変化はあなたの状態を示す客観的な指標になります。
        </p>
      </header>

      <section className={styles.chartSection}>
        {history.length > 0 ? (
          <PHQ9HistoryChart data={history} />
        ) : (
          <div className={styles.empty}>
            <p>まだデータがありません。</p>
            <button
              className={styles.backBtn}
              onClick={() => router.push(`/${userId}/assessments`)}
            >
              最初の診断を受ける
            </button>
          </div>
        )}
      </section>

      <div className={styles.infoBox}>
        <h3>グラフの読み方</h3>
        <ul>
          <li>
            <strong>0-4点:</strong> 正常範囲。現在の状態を維持しましょう。
          </li>
          <li>
            <strong>5-9点:</strong> 軽度の抑うつ。無理をせず、セルフケアを優先してください。
          </li>
          <li>
            <strong>10-14点:</strong> 中等度。カウンセリングや医師への相談を検討する時期です。
          </li>
          <li>
            <strong>15点以上:</strong> 重度。早急に専門家（主治医）への共有が必要です。
          </li>
        </ul>
      </div>
    </main>
  );
}
