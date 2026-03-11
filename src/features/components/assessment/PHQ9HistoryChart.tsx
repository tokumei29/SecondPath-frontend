'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import styles from './PHQ9HistoryChart.module.css';

interface HistoryData {
  date: string;
  score: number;
}

export const PHQ9HistoryChart = ({ data }: { data: HistoryData[] }) => {
  return (
    <div className={styles.chartWrapper}>
      <h3 className={styles.chartTitle}>メンタルヘルス推移 (PHQ-9)</h3>
      <div className={styles.container}>
        <ResponsiveContainer>
          <LineChart data={data} className={styles.lineChart}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className={styles.grid} />
            <XAxis dataKey="date" axisLine={false} tickLine={false} className={styles.xAxis} />
            <YAxis
              domain={[0, 27]}
              axisLine={false}
              tickLine={false}
              ticks={[0, 5, 10, 15, 20, 27]}
              className={styles.yAxis}
            />
            <Tooltip contentStyle={{}} wrapperClassName={styles.tooltipWrapper} />

            {/* 境界線 */}
            <ReferenceLine y={5} className={styles.refMild} />
            <ReferenceLine y={10} className={styles.refModerate} />
            <ReferenceLine y={15} className={styles.refSevere} />

            <Line
              type="monotone"
              dataKey="score"
              className={styles.mainLine}
              animationDuration={1500}
              dot={{ className: styles.lineDot, r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className={styles.caption}>※ 10点以上が続く場合は、専門家への相談を強く推奨します。</p>
    </div>
  );
};
