import { DiaryEditPage } from '@/features/dashboard/user/diaries/DiaryEditPage';

export default function DiaryEditRoute({ params }: { params: { diaryId: string } }) {
  return <DiaryEditPage params={params} />;
}
