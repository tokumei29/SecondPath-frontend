'use client';

import { useEffect, useState } from 'react';
import { formatDateForInput, formatJapanLocaleDate, toJapanCalendarDateString } from '@/lib/utils';
import styles from './Modal.module.css';

type Props = {
  record: {
    id: string;
    content: string;
    created_at: string;
    date?: string;
  } | null;
  onClose: () => void;
  onUpdate: (id: string, content: string, date: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export const RecordDetailModal = ({ record, onClose, onUpdate, onDelete }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editDate, setEditDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!record) return;
    setEditContent(record.content || '');
    setEditDate(
      formatDateForInput(record.date ?? record.created_at) ||
        toJapanCalendarDateString(new Date().toISOString())
    );
    setIsEditing(false);
  }, [record]);

  if (!record) return null;

  const displayDateLabel = formatJapanLocaleDate(record.date ?? record.created_at) || '日付不明';

  const resetFormFromRecord = () => {
    setEditContent(record.content || '');
    setEditDate(
      formatDateForInput(record.date ?? record.created_at) ||
        toJapanCalendarDateString(new Date().toISOString())
    );
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if (isSubmitting) return;
    const date = editDate.trim();
    if (!date) {
      alert('記録日を入力してください');
      return;
    }
    setIsSubmitting(true);
    try {
      await onUpdate(record.id, editContent, date);
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
            {isEditing ? '記録を編集' : `${displayDateLabel} の記録`}
          </h2>
          <div className={styles.headerActions}>
            {!isEditing && (
              <>
                <button type="button" onClick={() => setIsEditing(true)} className={styles.editBtn}>
                  編集
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className={styles.deleteBtn}
                  disabled={isSubmitting}
                >
                  削除
                </button>
              </>
            )}
            <button type="button" className={styles.closeIcon} onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className={styles.modalBody}>
          {!isEditing && (
            <p className={styles.metaLine}>
              <span className={styles.metaLabel}>記録日</span>
              {displayDateLabel}
            </p>
          )}
          {isEditing ? (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="record-edit-date">記録日</label>
                <input
                  id="record-edit-date"
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="record-edit-content">内容</label>
                <textarea
                  id="record-edit-content"
                  className={styles.editTextarea}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={10}
                />
              </div>
            </>
          ) : (
            <div className={styles.fullContent}>{record.content}</div>
          )}
        </div>

        {isEditing && (
          <div className={styles.modalFooter}>
            <button type="button" onClick={resetFormFromRecord} className={styles.cancelBtn}>
              キャンセル
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              className={styles.saveBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? '更新中...' : '更新保存'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
