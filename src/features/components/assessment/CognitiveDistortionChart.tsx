'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  PolarRadiusAxis,
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
  personalization: '個人化',
};

const DISTORTION_DESCRIPTIONS: Record<string, { title: string; desc: string; example: string }> = {
  all_or_nothing: {
    title: '全か無か思考',
    desc: '白か黒か、完璧か失敗かの両極端で判断してしまう。',
    example: '「一度のミスで、このプロジェクトはもう全部ダメだ」',
  },
  overgeneralization: {
    title: '一般化しすぎ',
    desc: 'たった一つの出来事を、すべてに当てはめて考える。',
    example: '「今日も叱られた。私はいつもどこへ行っても嫌われる」',
  },
  mental_filter: {
    title: '心のフィルター',
    desc: '悪いことばかりが目につき、良いことが見えなくなる。',
    example: '「9割は成功したが、あの1割の失敗のせいで最悪な一日だ」',
  },
  disqualifying_the_positive: {
    title: 'プラスの否定',
    desc: '良い出来事を「たまたまだ」と無視したり、悪く解釈する。',
    example: '「褒められたのは、相手がお世辞を言っているだけだ」',
  },
  jumping_to_conclusions: {
    title: '結論の飛躍',
    desc: '根拠がないのに、相手の気持ちを決めつけたり未来を悲観する。',
    example: '「返信が遅いのは、私が何か怒らせたに違いない」',
  },
  magnification_minimization: {
    title: '拡大・縮小',
    desc: '自分の失敗を大きく、自分の長所を極端に小さく考える。',
    example: '「これくらいの成功は誰でもできる。でもこのミスは致命的だ」',
  },
  emotional_reasoning: {
    title: '感情的判断',
    desc: '「そう感じるから、それは事実に違いない」と結論づける。',
    example: '「ひどく不安だ。だから、何か恐ろしいことが起きるはずだ」',
  },
  should_statements: {
    title: 'すべき思考',
    desc: '「〜すべき」「〜しなければならない」と自分や他人を縛る。',
    example: '「40代ならこれくらいできて当然だ。できない自分はクズだ」',
  },
  labeling: {
    title: 'レッテル貼り',
    desc: '一つのミスで、自分や他人にネガティブな名前を貼り付ける。',
    example: '「私は負け犬だ」「あの人は冷酷な人間だ」',
  },
  personalization: {
    title: '個人化',
    desc: '自分に関係のない悪い出来事まで、自分のせいだと思い込む。',
    example: '「チームの雰囲気が悪いのは、自分の立ち振る舞いのせいだ」',
  },
};

export const CognitiveDistortionChart = ({ scores }: { scores: Record<string, number> }) => {
  const data = Object.keys(FACTOR_LABELS).map((key) => ({
    subject: FACTOR_LABELS[key],
    value: scores[key] || 0,
  }));

  return (
    <>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer>
          <RadarChart data={data} className={styles.radarChart}>
            <PolarGrid className={styles.polarGrid} />
            <PolarAngleAxis dataKey="subject" className={styles.axisLabel} />
            <PolarRadiusAxis domain={[0, 8]} tick={false} axisLine={false} />
            <Radar name="思考の癖" dataKey="value" className={styles.radarArea} fillOpacity={0.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.explanationGrid}>
        {Object.entries(DISTORTION_DESCRIPTIONS).map(([key, info]) => {
          const score = scores[key] || 0;
          const isSevere = score >= 6;
          const isModerate = score >= 4 && score < 6;

          return (
            <div key={key} className={`${styles.infoCard} ${isModerate ? styles.highScore : ''}`}>
              <h4 className={styles.cardTitle}>{info.title}</h4>
              <p className={styles.cardDesc}>{info.desc}</p>
              <p className={styles.cardExample}>例: {info.example}</p>
              {isModerate && <span className={styles.warningBadge}>注意</span>}
              {isSevere && <span className={styles.warningBadge}>傾向あり</span>}
            </div>
          );
        })}
      </div>
    </>
  );
};
