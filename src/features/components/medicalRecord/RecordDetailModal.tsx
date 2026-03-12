'use client';

import styles from './Modal.module.css';

type Props = {
  record: {
    content: string;
    created_at: string;
  } | null;
  onClose: () => void;
};

export const RecordDetailModal = ({ record, onClose }: Props) => {
  if (!record) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {new Date(record.created_at).toLocaleDateString()} の記録
          </h2>
          <button className={styles.closeIcon} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.fullContent}>{record.content}</div>
      </div>
    </div>
  );
};
