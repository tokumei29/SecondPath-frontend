import { getUserDiaryServer } from '@/features/dashboard/user/diaries/api/getUserDiaryServer';
import { DiaryEditClient } from '@/features/dashboard/user/diaries/DiaryEditClient';

type Props = {
  params: { diaryId: string };
};

export async function DiaryEditPage({ params }: Props) {
  const diary = await getUserDiaryServer(params.diaryId);
  return <DiaryEditClient diaryId={params.diaryId} initialDiary={diary} />;
}
