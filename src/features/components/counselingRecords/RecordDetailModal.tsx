'use client';

import styles from './RecordDetailModal.module.css';

type RecordDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  record: any;
};

const RecordDetailModal = ({ isOpen, onClose, record }: RecordDetailModalProps) => {
  if (!isOpen || !record) return null;

  // Railsから届く「date」を使って変換する
  const displayDate = record.date
    ? new Date(record.date).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : '日付不明';

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          {/* 変数を displayDate に変更 */}
          <span className={styles.date}>{displayDate} の記録</span>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </header>

        <div className={styles.content}>
          <h2 className={styles.contentTitle}>支援内容・アドバイス</h2>
          <div className={styles.textArea}>{record.content}</div>
        </div>

        <footer className={styles.footer}>
          <button className={styles.primaryBtn} onClick={onClose}>
            閉じる
          </button>
        </footer>
      </div>
    </div>
  );
};

export default RecordDetailModal;
