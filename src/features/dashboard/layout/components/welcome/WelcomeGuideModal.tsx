'use client';

import { useRouter } from 'next/navigation';
import styles from './WelcomeGuideModal.module.css';

type Props = {
  isOpen: boolean;
  onClose?: () => void;
};

export const WelcomeGuideModal = ({ isOpen, onClose }: Props) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleStartSetup = () => {
    onClose?.();
    router.push('/settings');
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>再起動のための「自己分析」</h2>
        <div className={styles.content}>
          <p>
            SecondPathへようこそ。
            <br />
            アプリの利用を始める前に自己分析の設定をお願いしています。
          </p>

          <div className={styles.infoBox}>
            <p>
              <strong>自己分析が必要な理由</strong>
            </p>
            <ul>
              <li>自分の弱点や強みを客観視するため</li>
              <li>自分だけの「再起動の指針」を可視化するため</li>
            </ul>
          </div>
          <div className={styles.mustNote}>
            ※ ご利用にあたり、まずは設定内の<strong>名前</strong>のみ初期設定で必須としています。
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={handleStartSetup}>
            自己分析を設定する
          </button>
        </div>
      </div>
    </div>
  );
};
