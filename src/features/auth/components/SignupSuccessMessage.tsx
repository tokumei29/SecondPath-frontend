'use client';

import styles from './SignupSuccessMessage.module.css';

type SignupSuccessMessageProps = {
  email: string;
  onConfirm: () => void;
};

export const SignupSuccessMessage = ({ email, onConfirm }: SignupSuccessMessageProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconArea}>
        <span role="img" aria-label="email">
          ✉️
        </span>
      </div>
      <p className={styles.mainText}>
        <strong>{email}</strong> 宛に確認メールを送信しました。
      </p>
      <p className={styles.subText}>
        メール内のリンクをクリックしてアカウントを有効化した後、ログインしてください。
      </p>
      <div className={styles.buttonWrapper}>
        <button type="button" onClick={onConfirm} className={styles.confirmButton}>
          了解しました
        </button>
      </div>
    </div>
  );
};
