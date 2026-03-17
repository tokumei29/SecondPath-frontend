import { getTextSupportsServer } from '@/features/dashboard/user/textSupport/api/getTextSupportsServer';
import { TextSupportListPageClient } from '@/features/dashboard/user/textSupport/TextSupportListClient';

export async function TextSupportListPage() {
  const supports = await getTextSupportsServer();
  return <TextSupportListPageClient initialSupports={supports} />;
}
