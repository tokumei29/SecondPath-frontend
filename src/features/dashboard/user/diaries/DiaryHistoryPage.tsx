import { getUserDiariesServer } from '@/features/dashboard/user/diaries/api/getUserDiariesServer';
import { DiaryHistoryClient } from '@/features/dashboard/user/diaries/DiaryHistoryClient';

export async function DiaryHistoryPage() {
  const diaries = await getUserDiariesServer();
  return <DiaryHistoryClient initialDiaries={diaries} />;
}
