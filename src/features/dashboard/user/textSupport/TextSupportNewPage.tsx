import { getProfileServer } from '@/features/dashboard/user/settings/api/getProfileServer';
import { TextSupportNewPageClient } from '@/features/dashboard/user/textSupport/TextSupportNewClient';

export async function TextSupportNewPage() {
  const profile = await getProfileServer();
  return <TextSupportNewPageClient initialProfile={profile} />;
}
