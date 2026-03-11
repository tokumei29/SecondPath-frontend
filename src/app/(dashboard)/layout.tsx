'use client';

import React from 'react';
import { Sidebar } from '@/features/components/layout/sidebar';
import styles from './layout.module.css';

type UserLayoutProps = {
  children: React.ReactNode;
};

const UserLayout = ({ children }: UserLayoutProps) => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default UserLayout;
