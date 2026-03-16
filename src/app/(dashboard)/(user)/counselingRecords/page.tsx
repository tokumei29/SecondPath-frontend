'use client';

import { useState } from 'react';
import { CounselingRecord } from '@/api/userRecords';
import RecordDetailModal from '@/features/components/counselingRecords/RecordDetailModal';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useMyRecords } from '@/services/useUserRecords';
import styles from './page.module.css';

const CounselingRecordsPage = () => {
  const { records, isLoading } = useMyRecords();

  const [selectedRecord, setSelectedRecord] = useState<CounselingRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useBodyScrollLock(isModalOpen);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const handleOpenModal = (record: CounselingRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>📋 カウンセラーからのフィードバック</h1>
        <p className={styles.subtitle}>
          あなた専用の支援プログラムや、カウンセラーからの支援内容をいつでも確認できます。
        </p>
      </header>

      {isLoading ? (
        <div className={styles.loading}>読み込み中...</div>
      ) : (
        <div className={styles.grid}>
          {/* records は SWR から取得（undefined対策で ?. を使用） */}
          {records?.map((record) => (
            <div key={record.id} className={styles.card} onClick={() => handleOpenModal(record)}>
              <div className={styles.cardHeader}>
                <span className={styles.dateBadge}>{formatDate(record.date)}</span>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.excerpt}>
                  {record.content.length > 50
                    ? `${record.content.slice(0, 50)}...`
                    : record.content}
                </p>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.moreLink}>詳細を読む →</span>
              </div>
            </div>
          ))}

          {!isLoading && (!records || records.length === 0) && (
            <div className={styles.emptyContainer}>
              <p className={styles.emptyMessage}>現在、確認できるアドバイスはありません。</p>
            </div>
          )}
        </div>
      )}

      {/* 閲覧用モーダル */}
      <RecordDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        record={
          selectedRecord
            ? {
                date: selectedRecord.date,
                content: selectedRecord.content,
              }
            : null
        }
      />
    </div>
  );
};

export default CounselingRecordsPage;
