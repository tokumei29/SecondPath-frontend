'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  createUserRecord,
  deleteUserRecord,
  getUserRecords,
  updateUserRecord,
} from '@/features/admin/users/records/api/userRecordsClient';
import { CreateRecordModal } from '@/features/admin/users/records/components/CreateRecordModal';
import { RecordDetailModal } from '@/features/admin/users/records/components/RecordDetailModal';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import styles from './AdminUserRecordsPage.module.css';

type Props = {
  userId: string;
  initialData: any;
};

export const AdminUserRecordsClient = ({ userId, initialData }: Props) => {
  const [data, setData] = useState<any>(initialData);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  useBodyScrollLock(showCreateModal || !!selectedRecord);

  const fetchRecords = useCallback(async () => {
    try {
      const res = await getUserRecords(userId);
      setData(res.data);
    } catch (err) {
      console.error('取得失敗:', err);
    }
  }, [userId]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleSaveRecord = async (date: string, content: string) => {
    await createUserRecord(userId, date, content);
    await fetchRecords();
  };

  const handleUpdateRecord = async (recordId: string, content: string) => {
    try {
      await updateUserRecord(recordId, content);
      await fetchRecords();
    } catch {
      alert('更新に失敗しました');
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      await deleteUserRecord(recordId);
      await fetchRecords();
    } catch {
      alert('削除に失敗しました');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>📋 支援プログラム・記録: {data?.user_name}</h1>
          <p>相談記録・所見の管理、相談者に伝えたいこと</p>
          <p>ユーザーページの「カウンセラーからのフィードバック」に反映されます</p>
        </div>
        <button className={styles.createBtn} onClick={() => setShowCreateModal(true)}>
          ＋ 新規記録を作成
        </button>
      </header>

      <div className={styles.recordGrid}>
        {data?.records?.map((rec: any) => (
          <div key={rec.id} className={styles.recordCard} onClick={() => setSelectedRecord(rec)}>
            <span className={styles.dateLabel}>
              {new Date(rec.created_at).toLocaleDateString()}
            </span>
            <p className={styles.contentPreview}>{rec.content}</p>
          </div>
        ))}
        {data?.records?.length === 0 && <p className={styles.empty}>カルテがまだありません。</p>}
      </div>

      {showCreateModal && (
        <CreateRecordModal
          userName={data?.user_name}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveRecord}
        />
      )}

      {selectedRecord && (
        <RecordDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onUpdate={handleUpdateRecord}
          onDelete={handleDeleteRecord}
        />
      )}
    </div>
  );
};
