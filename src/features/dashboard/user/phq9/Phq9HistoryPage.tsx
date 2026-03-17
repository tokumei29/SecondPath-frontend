import { getPhq9AssessmentsServer } from '@/features/dashboard/user/phq9/api/getPhq9AssessmentsServer';
import { Phq9HistoryPageClient } from '@/features/dashboard/user/phq9/Phq9HistoryClient';

export async function Phq9HistoryPage() {
  const raw = await getPhq9AssessmentsServer();
  return <Phq9HistoryPageClient initialRawHistory={raw} />;
}
