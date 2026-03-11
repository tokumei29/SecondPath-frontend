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

interface PHQ9HistoryChartProps {
  data: HistoryData[];
}

export const PHQ9HistoryChart = ({ data }: PHQ9HistoryChartProps) => {
  return (
    <div className={styles.chartWrapper}>
      <h3 className={styles.chartTitle}>メンタルヘルス推移 (PHQ-9)</h3>
      <div className={styles.container}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
            <YAxis
              domain={[0, 27]}
              fontSize={12}
              axisLine={false}
              tickLine={false}
              ticks={[0, 5, 10, 15, 20, 27]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />

            {/* 重症度境界線の描画 */}
            <ReferenceLine
              y={5}
              label={{ position: 'right', value: '軽度', fontSize: 10, fill: '#888' }}
              stroke="#ccc"
              strokeDasharray="3 3"
            />
            <ReferenceLine
              y={10}
              label={{ position: 'right', value: '中等度', fontSize: 10, fill: '#888' }}
              stroke="#ffab00"
              strokeDasharray="3 3"
            />
            <ReferenceLine
              y={15}
              label={{ position: 'right', value: '重症', fontSize: 10, fill: '#d32f2f' }}
              stroke="#d32f2f"
              strokeDasharray="3 3"
            />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#0070f3"
              strokeWidth={3}
              dot={{ r: 6, fill: '#0070f3' }}
              activeDot={{ r: 8, strokeWidth: 0 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className={styles.caption}>※ 10点以上が続く場合は、専門家への相談を強く推奨します。</p>
    </div>
  );
};
