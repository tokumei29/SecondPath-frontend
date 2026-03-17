import Link from 'next/link';

type Props = {
  title?: string;
  description?: string;
  href?: string;
  linkLabel?: string;
};

export const RouteNotFound = ({
  title = 'ページが見つかりません',
  description = 'URLをご確認ください。',
  href = '/',
  linkLabel = 'トップへ戻る',
}: Props) => {
  return (
    <main style={{ maxWidth: 720, margin: '64px auto', padding: 24 }}>
      <h1 style={{ marginBottom: 12 }}>{title}</h1>
      <p style={{ marginBottom: 24, color: '#64748b' }}>{description}</p>
      <Link href={href}>{linkLabel}</Link>
    </main>
  );
};
