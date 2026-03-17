import Link from 'next/link';
import styles from './SidebarItem.module.css';

type SidebarItemProps = {
  href: string;
  active: boolean;
  icon: string;
  label: string;
  showBadge?: boolean;
};

export const SidebarItem = ({ href, active, icon, label, showBadge }: SidebarItemProps) => (
  <Link href={href} prefetch={false} className={`${styles.navItem} ${active ? styles.active : ''}`}>
    <span className={styles.icon}>{icon}</span>
    <span className={styles.label}>{label}</span>
    {showBadge && <span className={styles.unreadBadge}>未読あり</span>}
  </Link>
);
