'use client';

import { CognitiveDistortionChart } from '@/features/components/assessment/CognitiveDistortionChart';
import { useCognitiveDistortionHistory } from '@/services/useAssessments';
import styles from './page.module.css';

const CognitiveDistortionHistory = () => {
  const { latestResult, isLoading } = useCognitiveDistortionHistory();

  // デザイン維持のため、元の styles.loading を使用
  if (isLoading) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>思考の癖：診断履歴</h1>
        <p className={styles.subtitle}>
          あなたの思考の癖の診断結果です。スコアが高いほど、その傾向が強いことを示しています。
        </p>
      </header>

      {!latestResult ? (
        <div className={styles.empty}>履歴がありません。まずは診断を受けてみましょう。</div>
      ) : (
        <div className={styles.latestView}>
          <div className={styles.metaInfo}>
            {/* latestResult.date などのプロパティに直接アクセス */}
            <span className={styles.historyDate}>{latestResult?.date} の結果</span>
            <span className={styles.totalScoreLabel}>総合スコア: {latestResult?.total_score}</span>
          </div>

          <div className={styles.chartSection}>
            <CognitiveDistortionChart scores={latestResult?.scores} />
          </div>

          <div className={styles.historyFooter}>
            <p>※ スコアが中程度＝『傾向あり』、高い場合＝『注意』としています</p>
            <p>スコアが高いからダメということではなく自己分析の手掛かりとしてください</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CognitiveDistortionHistory;
