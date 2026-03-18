import { getUserDiaryServer } from '@/features/dashboard/user/diaries/api/getUserDiaryServer';
import { DiaryEditClient } from '@/features/dashboard/user/diaries/DiaryEditClient';

// 1. Propsの型定義を Promise に変更
type Props = {
  params: Promise<{ diaryId: string }>;
};

// 2. 必ず async function にする
export async function DiaryEditPage({ params }: Props) {
  // 3. ここで await して diaryId を取り出す（これが無いと undefined になる）
  const { diaryId } = await params;

  // 4. 正しい ID でサーバーからデータを取得
  const diary = await getUserDiaryServer(diaryId);

  return <DiaryEditClient diaryId={diaryId} initialDiary={diary} />;
}
