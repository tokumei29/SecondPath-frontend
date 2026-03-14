'use client';

import React from 'react';
import styles from './DeleteAccountModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteAccountModal = ({ isOpen, onClose, onConfirm }: Props) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.warningIcon}>⚠️</span>
          <h2 className={styles.title}>アカウント削除の最終確認</h2>
        </div>

        <div className={styles.body}>
          <p className={styles.alertText}>
            アカウントを削除すると、
            <strong>全てのデータが即座に消去され、二度と復元できません。</strong>
          </p>

          <div className={styles.warningCard}>
            <p className={styles.cardTitle}>以下のデータが完全に失われます：</p>
            <ul className={styles.list}>
              <li>これまでの全ての日報・振り返り記録</li>
              <li>自己分析設定および診断結果の履歴</li>
              <li>カウンセラーとの相談メッセージ履歴</li>
              <li>「SecondPath」への全てのアクセス権</li>
            </ul>
          </div>

          <p className={styles.confirmText}>
            本当に退会し、全てのデータを削除してもよろしいですか？
          </p>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            キャンセルして戻る
          </button>
          <button className={styles.deleteButton} onClick={onConfirm}>
            データを消去して退会する
          </button>
        </div>
      </div>
    </div>
  );
};
