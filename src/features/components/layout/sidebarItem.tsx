import Link from 'next/link';
import styles from './sidebarItem.module.css';

type SidebarItemProps = {
  href: string;
  active: boolean;
  icon: string;
  label: string;
};

export const SidebarItem = ({ href, active, icon, label }: SidebarItemProps) => (
  <Link href={href} className={`${styles.navItem} ${active ? styles.active : ''}`}>
    <span className={styles.icon}>{icon}</span>
    <span className={styles.label}>{label}</span>
  </Link>
);
