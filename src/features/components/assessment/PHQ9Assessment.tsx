'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createAssessment, getAssessments } from '@/api/assessments';
import { calculatePHQ9, type PHQ9Result } from '@/features/types/assessment';
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
  const [result, setResult] = useState<PHQ9Result | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [hasAnsweredToday, setHasAnsweredToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;

  useEffect(() => {
    const checkTodayStatus = async () => {
      if (!userId) return;
      try {
        const history = await getAssessments(userId);
        if (!history || history.length === 0) {
          setHasAnsweredToday(false);
          return;
        }

        // 今日の日付を YYYY-MM-DD 形式で作成
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const todayStr = `${y}-${m}-${d}`;

        // Railsから届く "2026-03-12" と直接比較
        const alreadyDone = history.some((item: any) => item.date === todayStr);

        setHasAnsweredToday(alreadyDone);
      } catch (e) {
        console.error('ステータス確認失敗', e);
      } finally {
        setIsLoading(false);
      }
    };
    checkTodayStatus();
  }, [userId]);

  if (isLoading) return <div>読み込み中...</div>;

  const handleSelect = (qIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = value;
    setAnswers(newAnswers);
  };

  const isComplete = answers.every((v) => v !== -1);

  const handleSubmit = async () => {
    if (!isComplete) return alert('全ての項目に回答してください。');

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

      await createAssessment(userId, payload);
      alert('診断結果を保存しました。');

      // グラフがある履歴ページへ遷移
      router.push(`/${userId}/assessments/history`);
    } catch (error) {
      console.error('保存失敗:', error);
      alert('データの保存に失敗しました。');
    }
  };

  if (hasAnsweredToday) {
    return (
      <div className={styles.container}>
        <div className={styles.doneCard}>
          <h3>本日のセルフチェックは完了しています</h3>
          <p>心の状態は少しずつ変化します。また明日、あなたの声を聞かせてください。</p>
          <button
            className={styles.historyBtn}
            onClick={() => router.push(`/${userId}/assessments/history`)}
          >
            これまでの推移を確認する
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>健康状態のセルフチェック (PHQ-9)</h2>

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
              <p className={styles.importantNote}>
                ※特に第9項目（自傷・希死念慮）に反応がある場合は、点数に関わらず速やかに主治医やカウンセラーへ共有してください。
              </p>
            </div>
          )}
        </div>

        {/* 質問リスト */}
        {!result ? (
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
            <button className={styles.submitBtn} disabled={!isComplete} onClick={handleSubmit}>
              結果を算出する
            </button>
          </div>
        ) : (
          /* 結果表示 */
          <div className={styles.resultCard}>
            <div className={styles.scoreBadge}>合計点: {result.totalScore}</div>
            <p className={styles.severity}>
              判定: <strong>{result.severity}</strong>
            </p>

            {result.suicidalIdeation && (
              <div className={styles.alert}>
                ⚠️ 第9項目に反応があります。主治医やカウンセラーにこの結果を共有してください。
              </div>
            )}

            <div className={styles.recommendation}>
              <h4>今後の指針</h4>
              <p>{result.recommendation}</p>
            </div>
            <button className={styles.resetBtn} onClick={() => setResult(null)}>
              再試行
            </button>
          </div>
        )}
      </div>
    );
  }
};
