'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { toJapanCalendarDateString } from '@/lib/utils';
import styles from './Modal.module.css';

type Props = {
  userName: string;
  onClose: () => void;
  onSave: (date: string, content: string) => Promise<void>;
};

export const CreateRecordModal = ({ userName, onClose, onSave }: Props) => {
  const params = useParams();
  const userId = params.id as string;

  const [date, setDate] = useState(() =>
    toJapanCalendarDateString(new Date().toISOString())
  );
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      await onSave(date, content);
      onClose();
    } catch {
      alert('保存に失敗しました。サーバーログを確認してください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>新規カルテ記入</h2>

        <div className={styles.formGroup}>
          <label>対象患者 (UUID: {userId?.slice(0, 8)}...)</label>
          <input type="text" value={userName} disabled className={styles.disabledInput} />
        </div>

        <div className={styles.formGroup}>
          <label>記録日</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className={styles.formGroup}>
          <label>内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            placeholder="相談内容や所見を記入してください..."
          />
        </div>

        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            キャンセル
          </button>
          <button className={styles.saveBtn} onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? '保存中...' : '保存する'}
          </button>
        </div>
      </div>
    </div>
  );
};
