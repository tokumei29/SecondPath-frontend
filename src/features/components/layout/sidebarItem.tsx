import Link from 'next/link';
import styles from './sidebarItem.module.css';

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
    {/* ★ 未読がある場合に赤いドットなどを表示 */}
    {showBadge && <span className={styles.unreadBadge}>未読あり</span>}
  </Link>
);
