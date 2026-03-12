'use client';

import styles from './SuccessModal.module.css';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
};

export const SuccessModal = ({ isOpen, onClose, title, message }: Props) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.icon}>🎉</div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <button className={styles.closeButton} onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
};
