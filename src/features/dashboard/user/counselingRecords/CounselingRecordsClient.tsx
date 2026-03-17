'use client';

import { useState } from 'react';
import type { CounselingRecord } from '@/features/dashboard/user/counselingRecords/api/userRecordsClient';
import RecordDetailModal from '@/features/dashboard/user/counselingRecords/components/RecordDetailModal';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import styles from './CounselingRecordsPage.module.css';

type Props = {
  initialRecords: CounselingRecord[];
};

export function CounselingRecordsClient({ initialRecords }: Props) {
  const [records] = useState<CounselingRecord[] | null>(initialRecords ?? []);
  const [isLoading] = useState(false);

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
}
