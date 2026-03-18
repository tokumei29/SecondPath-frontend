import Link from 'next/link';
import styles from './RouteNotFound.module.css';

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
    <main className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
      <Link href={href} className={styles.link}>
        {linkLabel}
      </Link>
    </main>
  );
};
