import { DiaryEditPage } from '@/features/dashboard/user/diaries/DiaryEditPage';

export default function DiaryEditRoute({ params }: { params: Promise<{ diaryId: string }> }) {
  // 2. そのまま渡す（DiaryEditPage 側で await するため）
  return <DiaryEditPage params={params} />;
}
