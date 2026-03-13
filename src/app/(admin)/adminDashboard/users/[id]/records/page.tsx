'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { createUserRecord, getUserRecords } from '@/api/userRecords';
import { CreateRecordModal } from '@/features/components/medicalRecord/CreateRecordModal';
import { RecordDetailModal } from '@/features/components/medicalRecord/RecordDetailModal';
import styles from './page.module.css';

const UserRecordsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const fetchRecords = useCallback(async () => {
    try {
      const res = await getUserRecords(id);
      setData(res.data);
    } catch (err) {
      console.error('取得失敗:', err);
    }
  }, [id]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleSaveRecord = async (date: string, content: string) => {
    // APIを叩く
    await createUserRecord(id, date, content);
    // 保存成功後に一覧を更新
    await fetchRecords();
  };

  if (!data) return <div className={styles.loading}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>📋 管理カルテ: {data.user_name}</h1>
          <p>相談記録・所見の管理</p>
        </div>
        <button className={styles.createBtn} onClick={() => setShowCreateModal(true)}>
          ＋ 新規記録を作成
        </button>
      </header>

      <div className={styles.recordGrid}>
        {data.records?.map((rec: any) => (
          <div key={rec.id} className={styles.recordCard} onClick={() => setSelectedRecord(rec)}>
            <span className={styles.dateLabel}>
              {new Date(rec.created_at).toLocaleDateString()}
            </span>
            <p className={styles.contentPreview}>{rec.content}</p>
          </div>
        ))}
        {data.records?.length === 0 && <p className={styles.empty}>カルテがまだありません。</p>}
      </div>

      {showCreateModal && (
        <CreateRecordModal
          userName={data.user_name}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveRecord}
        />
      )}

      {selectedRecord && (
        <RecordDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      )}
    </div>
  );
};

export default UserRecordsPage;
