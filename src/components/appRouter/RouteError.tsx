'use client';

import styles from './RouteError.module.css';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export const RouteError = ({ error, reset }: Props) => {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>エラーが発生しました</h1>
      <p className={styles.message}>リロードするか、時間をおいて再度お試しください。</p>
      <details className={styles.details}>
        <summary>詳細</summary>
        <pre>{error.message}</pre>
      </details>
      <div className={styles.actions}>
        <button type="button" className={styles.retryButton} onClick={reset}>
          再試行する
        </button>
      </div>
    </main>
  );
};
