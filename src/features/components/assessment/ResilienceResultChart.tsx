'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import styles from './ResilienceResultChart.module.css';

interface ResilienceData {
  novelty_seeking: number;
  emotional_regulation: number;
  adaptive_coping: number;
}

export const ResilienceResultChart = ({ data }: { data: ResilienceData }) => {
  const chartData = [
    { subject: '新奇性追求', score: data.novelty_seeking },
    { subject: '感情調整', score: data.emotional_regulation },
    { subject: '適応的対処', score: data.adaptive_coping },
  ];

  return (
    <div className={styles.chartCard}>
      <h3 className={styles.chartTitle}>レジリエンス・バランス</h3>

      <div className={styles.wrapper}>
        <ResponsiveContainer>
          <RadarChart data={chartData} className={styles.radarChart}>
            <PolarGrid className={styles.polarGrid} />
            <PolarAngleAxis
              dataKey="subject"
              className={styles.axisLabel}
            />
            <PolarRadiusAxis domain={[0, 9]} tick={false} axisLine={false} />

            <Radar
              name="Resilience"
              dataKey="score"
              className={styles.radarArea}
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.scoreGrid}>
        <div className={styles.scoreItem}>
          <span>新奇性</span>
          <strong>{data.novelty_seeking} / 9</strong>
        </div>
        <div className={styles.scoreItem}>
          <span>感情調整</span>
          <strong>{data.emotional_regulation} / 9</strong>
        </div>
        <div className={styles.scoreItem}>
          <span>適応対処</span>
          <strong>{data.adaptive_coping} / 9</strong>
        </div>
      </div>
    </div>
  );
};