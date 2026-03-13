'use client';

import { PHQ9Assessment } from '@/features/components/assessment/PHQ9Assessment';
import styles from './page.module.css';

const AssessmentPage = () => {
  return (
    <main>
      <PHQ9Assessment />
      <footer className={styles.footer}>
        <p>
          ※この診断は診断を確定させるものではありません。不安な場合は必ず医療機関を受診してください。
        </p>
      </footer>
    </main>
  );
};

export default AssessmentPage;
