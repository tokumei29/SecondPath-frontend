'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCognitiveDistortionHistory } from '@/api/assessments';
import { CognitiveDistortionChart } from '@/features/components/assessment/CognitiveDistortionChart';
import styles from './page.module.css';

const CognitiveDistortionHistory = () => {
  const { userId } = useParams();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getCognitiveDistortionHistory(userId as string);
        setHistory(data.reverse()); // 新しい順に表示
      } catch (error) {
        console.error('履歴の取得に失敗しました', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);

  if (loading) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>思考の癖：診断履歴</h1>

      {history.length === 0 ? (
        <div className={styles.empty}>履歴がありません。まずは診断を受けてみましょう。</div>
      ) : (
        <div className={styles.historyList}>
          {history.map((item) => (
            <div key={item.id} className={styles.historyCard}>
              <div className={styles.historyHeader}>
                <span className={styles.historyDate}>{item.date} の診断結果</span>
                <span className={styles.totalScoreLabel}>総合スコア: {item.total_score}</span>
              </div>

              <div className={styles.chartSection}>
                <CognitiveDistortionChart scores={item.scores} />
              </div>

              <div className={styles.historyFooter}>
                <p>※ 歪みの強い項目が突出して表示されます。</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CognitiveDistortionHistory;
