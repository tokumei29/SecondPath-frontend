import { getProfileServer } from '@/features/dashboard/user/settings/api/getProfileServer';
import { SettingsPageClient } from '@/features/dashboard/user/settings/SettingsPageClient';

export async function SettingsPage() {
  const profile = await getProfileServer();
  return <SettingsPageClient initialProfile={profile} />;
}
