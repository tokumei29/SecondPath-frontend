'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// カスタムフックをインポート
import { useResilience } from '@/services/useAssessments';
import styles from './ResilienceAssessment.module.css';

const QUESTIONS = [
  '新しい状況や変化に対して、面白そうだと感じる',
  '未経験のことでも、まずはやってみようと思う',
  '仕事のやり方が変わることを前向きに捉えられる',
  '失敗しても、それほど長く落ち込みを引きずらない',
  '嫌なことがあっても、自分で気分を切り替えられる',
  'プレッシャーがかかる場面でも、冷静でいられる',
  '困ったときは、ためらわずに周囲に助けを求められる',
  '状況に応じて、自分の考えや行動を柔軟に変えられる',
  '利用できるサポート（人・制度）を自分で探せる',
];

const OPTIONS = [
  { label: 'あてはまらない', value: 0 },
  { label: 'あまりあてはまらない', value: 1 },
  { label: 'ややあてはまる', value: 2 },
  { label: '非常によくあてはまる', value: 3 },
];

type Props = {
  onSubmit: (payload: any) => Promise<any>;
};

export const ResilienceAssessmentForm = ({ onSubmit }: Props) => {
  const router = useRouter();

  const [answers, setAnswers] = useState<number[]>(new Array(9).fill(-1));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const handleSelect = (idx: number, val: number) => {
    const newAns = [...answers];
    newAns[idx] = val;
    setAnswers(newAns);
  };

  const isComplete = answers.every((v) => v !== -1);

  const handleSubmit = async () => {
    if (!isComplete || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        q1: answers[0],
        q2: answers[1],
        q3: answers[2],
        q4: answers[3],
        q5: answers[4],
        q6: answers[5],
        q7: answers[6],
        q8: answers[7],
        q9: answers[8],
      });

      router.push('/resilience/history');
    } catch (err) {
      alert('保存に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>職業的レジリエンス尺度</h2>
        <p className={styles.subtitle}>今のあなたの「折れない心」のバランスを測定します。</p>
      </header>

      <div className={styles.infoSection}>
        <button className={styles.infoToggleButton} onClick={() => setShowInfo(!showInfo)}>
          {showInfo ? '▲ 説明を閉じる' : '▼ 職業的レジリエンス尺度とは？（必ずお読みください）'}
        </button>

        {showInfo && (
          <div className={styles.infoContent}>
            <p>
              職業的レジリエンス尺度は、仕事上の困難やストレスを乗り越え、環境に適応する力を測る指標です。以下の3つの側面からあなたの強みを可視化します。
            </p>
            <br />
            <div className={styles.severityTable}>
              <div className={styles.tableRow}>
                <strong className={styles.factorName}>新奇性追求:</strong>
                <span>変化や未知の状況を前向きに捉え、挑戦しようとする力。</span>
              </div>
              <div className={styles.tableRow}>
                <strong className={styles.factorName}>感情調整:</strong>
                <span>失敗やストレスに直面しても、感情をコントロールし立て直す力。</span>
              </div>
              <div className={styles.tableRow}>
                <strong className={styles.factorName}>適応的対処:</strong>
                <span>周囲の助けを借りたり、状況に合わせて柔軟に行動を変える力。</span>
              </div>
            </div>
            <br />
            <p className={styles.scoreGuide}>
              各因子 0〜9点（合計
              0〜27点）で算出されます。点数が高いほど、その領域の「回復力・適応力」が備わっていることを示します。
            </p>
          </div>
        )}
      </div>

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
