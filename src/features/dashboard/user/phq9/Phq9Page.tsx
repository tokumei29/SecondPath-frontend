'use client';

import { PHQ9Assessment } from '@/features/dashboard/user/assessments/components/PHQ9Assessment';
import { createPhq9Assessment } from '@/features/dashboard/user/phq9/api/phq9Client';
import styles from './Phq9Page.module.css';

export function Phq9PageClient() {
  return (
    <main className={styles.mainContainer}>
      <PHQ9Assessment onSubmit={createPhq9Assessment} />
      <footer className={styles.footer}>
        <p>
          ※この診断は診断を確定させるものではありません。不安な場合は必ず医療機関を受診してください。
        </p>
      </footer>
    </main>
  );
}
