'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getResilienceHistory } from '@/api/assessments';
import { ResilienceResultChart } from '@/features/components/assessment/ResilienceResultChart';
import styles from './page.module.css';

const ResilienceResultPage = () => {
  const router = useRouter();
  const [latestData, setLatestData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const history = await getResilienceHistory();
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
  }, []);

  if (isLoading) return <div className={styles.center}>読み込み中...</div>;
  if (!latestData) return <div className={styles.center}>データが見つかりませんでした。</div>;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>診断が完了しました</h1>
        <p className={styles.subtitle}>あなたの現在の「職業的レジリエンス」の状態です。</p>
      </header>

      <ResilienceResultChart data={latestData} />

      {/* --- 追加：指標の解説セクション --- */}
      <div className={styles.explanationSection}>
        <div className={styles.explainItem}>
          <h4 className={styles.explainTitle}>✨ 新奇性追求</h4>
          <p className={styles.explainText}>
            新しい環境や未知の体験に対して、前向きに関心を持つ力です。過去のキャリアに縛られず、
            <strong>「別の道（Second Path）」を探索するエネルギー</strong>を表します。
          </p>
        </div>

        <div className={styles.explainItem}>
          <h4 className={styles.explainTitle}>🧘 感情調整</h4>
          <p className={styles.explainText}>
            強いストレスや不安を感じたときに、自分の感情をコントロールして落ち着かせる力です。
            <strong>予期せぬ困難に直面しても、冷静に次の行動を考えるための土台</strong>となります。
          </p>
        </div>

        <div className={styles.explainItem}>
          <h4 className={styles.explainTitle}>🛠️ 適応的対処</h4>
          <p className={styles.explainText}>
            起きてしまった問題に対し、現実的な解決策を見つけて実行する力です。
            <strong>
              「今、自分に何ができるか」を具体的に考え、一歩ずつ状況を改善していく実践力
            </strong>
            を意味します。
          </p>
        </div>
      </div>

      <div className={styles.actionArea}>
        <button className={styles.backBtn} onClick={() => router.push('/home')}>
          ダッシュボードに戻る
        </button>
      </div>
    </main>
  );
};

export default ResilienceResultPage;
