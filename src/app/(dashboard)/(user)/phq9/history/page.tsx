'use client';

import { PHQ9HistoryChart } from '@/features/components/assessment/PHQ9HistoryChart';
import { usePhq9 } from '@/hooks/useAssessments';
import styles from './page.module.css';

const AssessmentHistoryPage = () => {
  // カスタムフックを呼ぶだけ。加工済みの history が手に入る。
  const { history, isLoading } = usePhq9();

  if (isLoading) return <div className={styles.loading}>履歴を読み込み中...</div>;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>PHQ-9：診断履歴</h1>
        <p className={styles.subtitle}>
          これまでのアセスメント結果の推移です。点数の変化はあなたの状態を示す客観的な指標になります。
        </p>
      </header>

      {history && history.length > 0 ? (
        <>
          <section className={styles.chartSection}>
            <PHQ9HistoryChart data={history} />
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
                <strong>10-14点:</strong>{' '}
                調整が必要。一人で抱え込まず、外部の視点を取り入れる検討を。
              </li>
              <li>
                <strong>15点以上:</strong>{' '}
                強い負荷。今は無理をせず、状態を優先して共有・相談してください。
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div className={styles.empty}>
          <p>履歴がありません。まずは診断を受けてみましょう。</p>
        </div>
      )}
    </main>
  );
};

export default AssessmentHistoryPage;
