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
  novelty_seeking: number; // 0-9点
  emotional_regulation: number; // 0-9点
  adaptive_coping: number; // 0-9点
  date?: string;
}

export const ResilienceResultChart = ({ data }: { data: ResilienceData }) => {
  // Recharts用のデータ形式に変換
  const chartData = [
    { subject: '新奇性追求', score: data.novelty_seeking, fullMark: 9 },
    { subject: '感情調整', score: data.emotional_regulation, fullMark: 9 },
    { subject: '適応的対処', score: data.adaptive_coping, fullMark: 9 },
  ];

  return (
    <div className={styles.chartCard}>
      <h3 className={styles.chartTitle}>レジリエンス・バランス</h3>

      <div className={styles.wrapper}>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#475569', fontSize: 14, fontWeight: 700 }}
            />
            {/* 0点から9点までのメモリ。目盛り線は見せず、範囲だけ指定 */}
            <PolarRadiusAxis angle={30} domain={[0, 9]} tick={false} axisLine={false} />

            <Radar
              name="Resilience"
              dataKey="score"
              stroke="#0070f3"
              fill="#0070f3"
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
