'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCognitiveDistortion } from '@/services/useAssessments';
import styles from './CognitiveDistortion.module.css';

const DISTORTION_QUESTIONS = [
  // 1. 全か無か思考 (All-or-Nothing Thinking)
  {
    id: 1,
    factor: 'all_or_nothing',
    text: '物事を「完璧か、さもなくば失敗か」のどちらかで考えてしまいますか？',
  },
  {
    id: 2,
    factor: 'all_or_nothing',
    text: '一度のミスで、これまでの努力がすべて無駄になったと感じることがありますか？',
  },

  // 2. 一般化のしすぎ (Overgeneralization)
  {
    id: 3,
    factor: 'overgeneralization',
    text: '一度嫌なことがあると、「いつもこうだ」「次も失敗する」と考えがちですか？',
  },
  {
    id: 4,
    factor: 'overgeneralization',
    text: 'たった一つの悪い出来事を、世の中のすべてのことに当てはめてしまいますか？',
  },

  // 3. 心のフィルター (Mental Filter)
  {
    id: 5,
    factor: 'mental_filter',
    text: '全体がうまくいっていても、一つの小さなミスばかりを気にしてしまいますか？',
  },
  {
    id: 6,
    factor: 'mental_filter',
    text: '良い出来事があってもそれを無視して、悪い側面だけを見つめる傾向がありますか？',
  },

  // 4. マイナス思考（プラスの否定） (Disqualifying the Positive)
  {
    id: 7,
    factor: 'disqualifying_the_positive',
    text: '褒められたり成功したりしても、「たまたまだ」「大したことない」と否定しますか？',
  },
  {
    id: 8,
    factor: 'disqualifying_the_positive',
    text: '自分に備わっている良い資質を、取るに足らないものとして扱ってしまいますか？',
  },

  // 5. 結論の飛躍 (Jumping to Conclusions)
  {
    id: 9,
    factor: 'jumping_to_conclusions',
    text: '相手の反応を見て「きっと嫌われた」と根拠なく思い込むことがありますか？',
  },
  {
    id: 10,
    factor: 'jumping_to_conclusions',
    text: '将来について、何の根拠もないのに「きっと悪いことが起きる」と予言してしまいますか？',
  },

  // 6. 拡大解釈・過小評価 (Magnification & Minimization)
  {
    id: 11,
    factor: 'magnification_minimization',
    text: '自分の欠点を過大に考え、逆に長所を過小評価する傾向がありますか？',
  },
  {
    id: 12,
    factor: 'magnification_minimization',
    text: '他人の成功を非常に大きく、自分の成功を非常に小さく感じてしまいますか？',
  },

  // 7. 感情的決めつけ (Emotional Reasoning)
  {
    id: 13,
    factor: 'emotional_reasoning',
    text: '「不安に感じるから、実際に状況が悪いはずだ」と感情で判断しますか？',
  },
  {
    id: 14,
    factor: 'emotional_reasoning',
    text: '「自分が無能だと感じるから、自分は本当に無能だ」と思い込んでしまいますか？',
  },

  // 8. すべき思考 (Should Statements)
  {
    id: 15,
    factor: 'should_statements',
    text: '自分に対して「〜すべきだ」「〜してはならない」と強く縛り、苦しくなりますか？',
  },
  {
    id: 16,
    factor: 'should_statements',
    text: '他人が自分の期待通りに動かないと、強い怒りや苛立ちを感じますか？',
  },

  // 9. レッテル貼り (Labeling)
  {
    id: 17,
    factor: 'labeling',
    text: 'ミスをした時、自分を「ダメな人間だ」「落伍者だ」と決めつけた名前で呼びますか？',
  },
  {
    id: 18,
    factor: 'labeling',
    text: '他人の一つの行動を見て「あの人は冷酷な人だ」とラベルを貼ってしまいますか？',
  },

  // 10. 個人化（自分への関連付け） (Personalization)
  {
    id: 19,
    factor: 'personalization',
    text: '自分に関係のない悪い出来事まで、「自分のせいだ」と感じてしまいますか？',
  },
  {
    id: 20,
    factor: 'personalization',
    text: '誰かが不機嫌そうなのを見ると、「自分が何か悪いことをしたのでは」と心配になりますか？',
  },
];

const OPTIONS = [
  { label: '全くない', value: 0 },
  { label: 'たまにある', value: 1 },
  { label: '時々ある', value: 2 },
  { label: 'よくある', value: 3 },
  { label: 'いつも', value: 4 },
];

export const CognitiveDistortionForm = () => {
  const router = useRouter();
  // SWR のカスタムフックから create (mutateを含む) を取り出す
  const { create } = useCognitiveDistortion();

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showInfo, setShowInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (id: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const isComplete = Object.keys(answers).length === DISTORTION_QUESTIONS.length;

  const handleSubmit = async () => {
    if (!isComplete) {
      alert('すべての質問に回答してください');
      return;
    }

    setIsSubmitting(true);
    try {
      const scoresByFactor: Record<string, number> = {};
      DISTORTION_QUESTIONS.forEach((q) => {
        const score = answers[q.id] || 0;
        scoresByFactor[q.factor] = (scoresByFactor[q.factor] || 0) + score;
      });

      // 直接 API を叩くのではなく、フックの create を使う
      // この内部で mutate() が走るので、キャッシュが自動更新されます
      await create(scoresByFactor);

      router.push('/cognitiveDistortions/history');
    } catch (error) {
      alert('保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* 以下の JSX 構造は一切変更なし */}
      <h1 className={styles.title}>認知の歪みアセスメント</h1>

      <div className={styles.infoSection}>
        <button className={styles.infoToggleButton} onClick={() => setShowInfo(!showInfo)}>
          {showInfo ? '▲ 説明を閉じる' : '▼ 認知の歪みとは？（必ずお読みください）'}
        </button>
        {showInfo && (
          <div className={styles.infoContent}>
            <p>
              認知の歪みとは、ストレスが強い時に陥りやすい「思考の癖」のことです。客観的に自分のパターンを知ることで、気持ちを楽にするヒントが見つかります。
            </p>
          </div>
        )}
      </div>

      <div className={styles.questionList}>
        {DISTORTION_QUESTIONS.map((q) => (
          <div key={q.id} className={styles.questionCard}>
            <p className={styles.questionText}>{q.text}</p>
            <div className={styles.options}>
              {OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.optionButton} ${
                    answers[q.id] === opt.value ? styles.active : ''
                  }`}
                  onClick={() => handleSelect(q.id, opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        className={styles.submitBtn}
        disabled={!isComplete || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? '保存中...' : '診断結果を保存する'}
      </button>
    </div>
  );
};
