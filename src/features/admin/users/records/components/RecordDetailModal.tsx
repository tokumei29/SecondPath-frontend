'use client';

import { useState } from 'react';
import styles from './Modal.module.css';

type Props = {
  record: {
    id: string;
    content: string;
    created_at: string;
  } | null;
  onClose: () => void;
  onUpdate: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export const RecordDetailModal = ({ record, onClose, onUpdate, onDelete }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(record?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!record) return null;

  const handleUpdate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onUpdate(record.id, editContent);
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error('更新エラー:', error);
      alert('更新に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('この記録を削除してもよろしいですか？')) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onDelete(record.id);
      onClose();
    } catch (error) {
      console.error('削除エラー:', error);
      alert('削除に失敗しました。');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {new Date(record.created_at).toLocaleDateString()} の記録
          </h2>
          <div className={styles.headerActions}>
            {!isEditing && (
              <>
                <button onClick={() => setIsEditing(true)} className={styles.editBtn}>
                  編集
                </button>
                <button onClick={handleDelete} className={styles.deleteBtn} disabled={isSubmitting}>
                  削除
                </button>
              </>
            )}
            <button className={styles.closeIcon} onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className={styles.modalBody}>
          {isEditing ? (
            <textarea
              className={styles.editTextarea}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={10}
            />
          ) : (
            <div className={styles.fullContent}>{record.content}</div>
          )}
        </div>

        {isEditing && (
          <div className={styles.modalFooter}>
            <button onClick={() => setIsEditing(false)} className={styles.cancelBtn}>
              キャンセル
            </button>
            <button onClick={handleUpdate} className={styles.saveBtn} disabled={isSubmitting}>
              {isSubmitting ? '更新中...' : '更新保存'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
