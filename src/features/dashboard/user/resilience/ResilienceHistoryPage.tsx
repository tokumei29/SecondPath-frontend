import { getResilienceHistoryServer } from '@/features/dashboard/user/resilience/api/getResilienceHistoryServer';
import { ResilienceHistoryPageClient } from '@/features/dashboard/user/resilience/ResilienceHistoryClient';

export async function ResilienceHistoryPage() {
  const history = await getResilienceHistoryServer();
  return <ResilienceHistoryPageClient initialHistory={history} />;
}
