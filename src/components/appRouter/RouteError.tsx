'use client';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export const RouteError = ({ error, reset }: Props) => {
  return (
    <main style={{ maxWidth: 720, margin: '64px auto', padding: 24 }}>
      <h1 style={{ marginBottom: 12 }}>エラーが発生しました</h1>
      <p style={{ marginBottom: 16, color: '#64748b' }}>時間をおいて再度お試しください。</p>
      <details style={{ marginBottom: 24 }}>
        <summary>詳細</summary>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
      </details>
      <button type="button" onClick={reset}>
        再試行
      </button>
    </main>
  );
};
