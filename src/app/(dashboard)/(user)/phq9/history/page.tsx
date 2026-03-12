'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPhq9Assessments } from '@/api/assessments';
import { PHQ9HistoryChart } from '@/features/components/assessment/PHQ9HistoryChart';
import styles from './page.module.css';

type HistoryData = {
  date: string;
  score: number;
};

const AssessmentHistoryPage = () => {
  const router = useRouter();

  const [history, setHistory] = useState<HistoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getPhq9Assessments();

        /**
         * 1. 日付(item.date)をキーにしたオブジェクトを作成。
         * Railsが昇順(ASC)で送ってくるなら、ループの後半で出てくる「新しいデータ」が
         * 同じ日付の「古いデータ」を自動的に上書きします。
         */
        const dailyLatestMap: Record<string, HistoryData> = {};

        data.forEach((item: any) => {
          dailyLatestMap[item.date] = {
            date: item.date,
            score: item.score,
          };
        });

        // 2. オブジェクトを配列に戻し、念のため日付順にソートしてStateへ
        const uniqueData = Object.values(dailyLatestMap).sort((a, b) =>
          a.date.localeCompare(b.date)
        );

        setHistory(uniqueData);
      } catch (error) {
        console.error('履歴の取得に失敗:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

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
            <button className={styles.backBtn} onClick={() => router.push('/assessments')}>
              最初の診断を受ける
            </button>
          </div>
        )}
      </section>

      <div className={styles.infoBox}>
        <h3>グラフの読み方</h3>
        <ul>
          <li>
            <strong>0-4点:</strong> 安定した状態。今の習慣を続けていきましょう。
          </li>
          <li>
            <strong>5-9点:</strong> 軽微な負荷。セルフケアを少し厚めにする時期です。
          </li>
          <li>
            <strong>10-14点:</strong> 調整が必要。一人で抱え込まず、外部の視点を取り入れる検討を。
          </li>
          <li>
            <strong>15点以上:</strong>{' '}
            強い負荷。今は無理をせず、状態を優先して共有・相談してください。
          </li>
        </ul>
      </div>
    </main>
  );
};

export default AssessmentHistoryPage;
