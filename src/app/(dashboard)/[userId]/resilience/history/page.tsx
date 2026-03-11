'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getResilienceHistory } from '@/api/assessments';
import { ResilienceResultChart } from '@/features/components/assessment/ResilienceResultChart';
import styles from './page.module.css';

export default function ResilienceResultPage() {
  const { userId } = useParams();
  const router = useRouter();
  const [latestData, setLatestData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const history = await getResilienceHistory(userId as string);
        if (history && history.length > 0) {
          // 配列の最後（最新）のデータを使用
          setLatestData(history[history.length - 1]);
        }
      } catch (error) {
        console.error('Failed to fetch resilience result', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatest();
  }, [userId]);

  if (isLoading) return <div className={styles.center}>読み込み中...</div>;
  if (!latestData) return <div className={styles.center}>データが見つかりませんでした。</div>;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>診断が完了しました</h1>
        <p className={styles.subtitle}>あなたの現在の「職業的レジリエンス」の状態です。</p>
      </header>

      <ResilienceResultChart data={latestData} />

      <div className={styles.actionArea}>
        <button className={styles.backBtn} onClick={() => router.push(`/${userId}/home`)}>
          ダッシュボードに戻る
        </button>
      </div>
    </main>
  );
}
