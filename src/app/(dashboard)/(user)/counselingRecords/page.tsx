'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMyRecords, type CounselingRecord } from '@/api/userRecords';
import RecordDetailModal from '@/features/components/counselingRecords/RecordDetailModal';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import styles from './page.module.css';

const CounselingRecordsPage = () => {
  const [records, setRecords] = useState<CounselingRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<CounselingRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useBodyScrollLock(isModalOpen);

  // 1. 自分の記録を取得
  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getMyRecords();
      setRecords(data);
    } catch (error) {
      console.error('記録の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // 不正な場合はそのまま返す
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // 2. モーダルを開く
  const handleOpenModal = (record: CounselingRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>📋 カウンセラーからのアドバイス</h1>
        <p className={styles.subtitle}>
          あなた専用の復帰プログラムや、カウンセラーからの支援内容をいつでも確認できます。
        </p>
      </header>

      {isLoading ? (
        <div className={styles.loading}>読み込み中...</div>
      ) : (
        <div className={styles.grid}>
          {records.map((record) => (
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

          {!isLoading && records.length === 0 && (
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
                date: selectedRecord.date, // APIに合わせて調整
                content: selectedRecord.content,
              }
            : null
        }
      />
    </div>
  );
};

export default CounselingRecordsPage;
