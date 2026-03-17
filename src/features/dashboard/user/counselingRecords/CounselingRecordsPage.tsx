import { getMyRecordsServer } from '@/features/dashboard/user/counselingRecords/api/getMyRecordsServer';
import { CounselingRecordsClient } from '@/features/dashboard/user/counselingRecords/CounselingRecordsClient';

export async function CounselingRecordsPage() {
  const records = await getMyRecordsServer();
  return <CounselingRecordsClient initialRecords={records} />;
}
