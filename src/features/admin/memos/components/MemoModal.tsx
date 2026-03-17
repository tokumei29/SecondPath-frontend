'use client';

import type { MemoResponse } from '@/features/admin/memos/api/memosClient';
import styles from './MemoModal.module.css';

type MemoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  currentMemo: Partial<MemoResponse> | null;
  setCurrentMemo: (memo: Partial<MemoResponse>) => void;
  isEditing: boolean;
  isReadOnly?: boolean;
};

export default function MemoModal({
  isOpen,
  onClose,
  onSave,
  currentMemo,
  setCurrentMemo,
  isEditing,
  isReadOnly = false,
}: MemoModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>
          {isReadOnly ? '📋 記録の詳細' : isEditing ? '📝 記録を編集' : '✨ 新規記録作成'}
        </h2>

        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>相談者名</label>
            <input
              type="text"
              className={styles.input}
              readOnly={isReadOnly}
              value={currentMemo?.user_name || ''}
              onChange={(e) => setCurrentMemo({ ...currentMemo!, user_name: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>実施日</label>
            <input
              type="date"
              className={styles.input}
              readOnly={isReadOnly}
              value={currentMemo?.date || ''}
              onChange={(e) => setCurrentMemo({ ...currentMemo!, date: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>カウンセリング内容メモ</label>
            <textarea
              rows={10}
              className={styles.textarea}
              readOnly={isReadOnly}
              value={currentMemo?.content || ''}
              onChange={(e) => setCurrentMemo({ ...currentMemo!, content: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelButton}>
            {isReadOnly ? '閉じる' : 'キャンセル'}
          </button>
          {!isReadOnly && (
            <button onClick={onSave} className={styles.saveButton}>
              {isEditing ? '更新する' : '保存する'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
