import { getCognitiveDistortionHistoryServer } from '@/features/dashboard/user/cognitiveDistortions/api/getCognitiveDistortionHistoryServer';
import { CognitiveDistortionsHistoryPageClient } from '@/features/dashboard/user/cognitiveDistortions/CognitiveDistortionsHistoryPage';

export async function CognitiveDistortionsHistoryPage() {
  const history = await getCognitiveDistortionHistoryServer();
  return <CognitiveDistortionsHistoryPageClient initialHistory={history} />;
}
