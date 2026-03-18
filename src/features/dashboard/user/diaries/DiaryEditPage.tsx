import { getUserDiaryServer } from '@/features/dashboard/user/diaries/api/getUserDiaryServer';
import { DiaryEditClient } from '@/features/dashboard/user/diaries/DiaryEditClient';

// 1. Propsの型定義を Promise に変更
type Props = {
  params: Promise<{ diaryId: string }>;
};

// 2. async 関数内で await を使って id を取り出す
export async function DiaryEditPage({ params }: Props) {
  // ここで await しないと params.diaryId は undefined になり、APIが死にます
  const { diaryId } = await params;

  // 正しく取得した diaryId を渡す
  const diary = await getUserDiaryServer(diaryId);

  return <DiaryEditClient diaryId={diaryId} initialDiary={diary} />;
}
