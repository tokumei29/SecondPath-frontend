'use client';

import React, { ReactNode, MouseEvent } from 'react';
import styles from './modal.module.css';

type ModalProps = {
  isOpen: boolean;
  children: ReactNode;
  title?: string;
};

export const Modal = ({ isOpen, children, title }: ModalProps) => {
  if (!isOpen) return null;

  // モーダル本体のクリックが背景に伝播して意図しない挙動になるのを防ぐ
  const handleContentClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.content} onClick={handleContentClick}>
        {title && <h2 className={styles.modalTitle}>{title}</h2>}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};
