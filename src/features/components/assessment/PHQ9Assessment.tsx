'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPhq9Assessment } from '@/api/assessments';
import { calculatePHQ9 } from '@/features/types/assessment';
import styles from './PHQ9Assessment.module.css';

const QUESTIONS = [
  '物事に対してほとんど興味がない、または楽しめない',
  '気分が落ち込む、憂うつになる、または絶望的な気持ちになる',
  '寝つきが悪い、途中で目が覚める、または逆に寝すぎしまう',
  '疲れた感じがする、または気力がない',
  '食欲がない、または逆に食べすぎてしまう',
  '自分は失格者だ、または家族に申し訳ないと感じる',
  '新聞を読む、またはテレビを見るなどの物事に集中することが難しい',
  '他人が気づくほど動きや話し方が遅い、または落ち着かず動き回ってしまう',
  '死んだほうがよい、あるいは自分を何らかの形で傷つけたいと思ったことがある',
];

const OPTIONS = [
  { label: 'まったくない', value: 0 },
  { label: '数日', value: 1 },
  { label: '半分以上', value: 2 },
  { label: 'ほとんど毎日', value: 3 },
];

export const PHQ9Assessment = () => {
  const [answers, setAnswers] = useState<number[]>(new Array(9).fill(-1));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // マウント時に読み込み完了とする
    setIsLoading(false);
  }, []);

  if (isLoading) return <div>読み込み中...</div>;

  const handleSelect = (qIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = value;
    setAnswers(newAnswers);
  };

  const isComplete = answers.every((v) => v !== -1);

  const handleSubmit = async () => {
    if (!isComplete) return alert('全ての項目に回答してください。');
    setIsSubmitting(true);

    const res = calculatePHQ9(answers);

    try {
      // Railsに保存するためのデータ構造を作成
      const payload = {
        total_score: res.totalScore,
        q1: answers[0],
        q2: answers[1],
        q3: answers[2],
        q4: answers[3],
        q5: answers[4],
        q6: answers[5],
        q7: answers[6],
        q8: answers[7],
        q9: answers[8],
        suicidal_ideation: res.suicidalIdeation,
      };

      await createPhq9Assessment(payload);
      alert('診断結果を保存しました。');

      // グラフがある履歴ページへ遷移
      router.push('/phq9/history');
    } catch (error) {
      console.error('保存失敗:', error);
      alert('データの保存に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>健康状態のセルフチェック (PHQ-9)</h1>
        <p className={styles.description}>
          現在のあなたの心の状態を、医学的な指標（PHQ-9）に基づいて客観的に把握します。
          <br />
        </p>
      </header>

      <div className={styles.container}>
        {/* PHQ-9の説明セクション */}
        <div className={styles.infoSection}>
          <button className={styles.infoToggleButton} onClick={() => setShowInfo(!showInfo)}>
            {showInfo ? '▲ 説明を閉じる' : '▼ PHQ-9診断とは？（必ずお読みください）'}
          </button>

          {showInfo && (
            <div className={styles.infoContent}>
              <p>
                PHQ-9は、世界的に使用されているうつ病の重症度を測る指標です。過去2週間の状態を振り返って回答してください。
              </p>
              <br />
              <div className={styles.severityTable}>
                <div className={styles.tableRow}>
                  <span>0-4点:</span> <span>極めて軽微（正常範囲）</span>
                </div>
                <div className={styles.tableRow}>
                  <span>5-9点:</span> <span>軽度（セルフケア推奨）</span>
                </div>
                <div className={styles.tableRow}>
                  <span>10-14点:</span> <span>中等度（専門家への相談を検討）</span>
                </div>
                <div className={styles.tableRow}>
                  <span>15-19点:</span> <span>中等度～重度（積極的な加療が必要）</span>
                </div>
                <div className={styles.tableRow}>
                  <span>20点以上:</span> <span>重度（早急な医療機関受診が必要）</span>
                </div>
              </div>
              <br />
              <p className={styles.importantNote}>
                ※特に第9項目（自傷・希死念慮）に反応がある場合は、点数に関わらず速やかに主治医やカウンセラーへ共有してください。
              </p>
            </div>
          )}
        </div>

        {/* 質問リスト */}
        <div className={styles.questionList}>
          {QUESTIONS.map((q, i) => (
            <div key={i} className={styles.questionCard}>
              <p className={styles.questionText}>
                {i + 1}. {q}
              </p>
              <div className={styles.options}>
                {OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={answers[i] === opt.value ? styles.activeBtn : styles.btn}
                    onClick={() => handleSelect(i, opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            className={styles.submitBtn}
            disabled={!isComplete || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? '保存中...' : '診断結果を保存する'}
          </button>
        </div>
      </div>
    </>
  );
};
