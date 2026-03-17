import { getHomeDataServer } from '@/features/dashboard/user/home/api/getHomeDataServer';
import { HomePageClient } from '@/features/dashboard/user/home/HomePageClient';

export async function HomePage() {
  const { profile, diaries, supports, hasTodayAdvice } = await getHomeDataServer();
  return (
    <HomePageClient
      initialProfile={profile}
      initialDiaries={diaries}
      initialSupports={supports}
      initialHasTodayAdvice={hasTodayAdvice}
    />
  );
}
