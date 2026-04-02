export type PHQ9Severity = 'none' | 'mild' | 'moderate' | 'moderately_severe' | 'severe';

export type PHQ9Result = {
  totalScore: number;
  severity: PHQ9Severity;
  suicidalIdeation: boolean; // 第9項目のチェック
  recommendation: string;
};

// 評価ロジック
export const calculatePHQ9 = (scores: number[]): PHQ9Result => {
  if (scores.length !== 9) throw new Error('不正なデータ形式です。');

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const suicidalIdeation = scores[8] > 0; // 0（まったくない）以外は全て検知

  let severity: PHQ9Severity = 'none';
  let recommendation = '';

  if (totalScore <= 4) {
    severity = 'none';
    recommendation = '特になし';
  } else if (totalScore <= 9) {
    severity = 'mild';
    recommendation = '経過観察';
  } else if (totalScore <= 14) {
    severity = 'moderate';
    recommendation = 'カウンセリング、または薬剤療法の検討';
  } else if (totalScore <= 19) {
    severity = 'moderately_severe';
    recommendation = '薬剤療法、カウンセリングなどの積極的な治療';
  } else {
    severity = 'severe';
    recommendation = '積極的な治療、場合によっては専門機関への緊急受診';
  }

  return { totalScore, severity, suicidalIdeation, recommendation };
};
