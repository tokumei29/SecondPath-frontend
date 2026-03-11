'use client';

import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, PolarRadiusAxis
} from 'recharts';
import styles from './CognitiveDistortionChart.module.css';

const FACTOR_LABELS: Record<string, string> = {
  all_or_nothing: '全か無か',
  overgeneralization: '一般化しすぎ',
  mental_filter: '心のフィルター',
  disqualifying_the_positive: 'プラスの否定',
  jumping_to_conclusions: '結論の飛躍',
  magnification_minimization: '拡大・縮小',
  emotional_reasoning: '感情的判断',
  should_statements: 'すべき思考',
  labeling: 'レッテル貼り',
  personalization: '個人化'
};

export const CognitiveDistortionChart = ({ scores }: { scores: Record<string, number> }) => {
  const data = Object.keys(FACTOR_LABELS).map(key => ({
    subject: FACTOR_LABELS[key],
    value: scores[key] || 0,
  }));

  return (
    <div className={styles.chartWrapper}>
      {/* width/height を指定しないことで親のCSSに従う */}
      <ResponsiveContainer>
        <RadarChart data={data} className={styles.radarChart}>
          <PolarGrid className={styles.polarGrid} />
          <PolarAngleAxis 
            dataKey="subject" 
            className={styles.axisLabel} 
          />
          <PolarRadiusAxis 
            domain={[0, 8]} 
            tick={false} 
            axisLine={false} 
          />
          <Radar
            name="思考の癖"
            dataKey="value"
            className={styles.radarArea}
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};