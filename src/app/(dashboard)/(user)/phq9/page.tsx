'use client';

import { PHQ9Assessment } from '@/features/components/assessment/PHQ9Assessment';
import { usePhq9 } from '@/services/useAssessments';
import styles from './page.module.css';

const AssessmentPage = () => {

  const { create } = usePhq9();

  return (
    <main className={styles.mainContainer}>
      <PHQ9Assessment onSubmit={create} />
      <footer className={styles.footer}>
        <p>
          ※この診断は診断を確定させるものではありません。不安な場合は必ず医療機関を受診してください。
        </p>
      </footer>
    </main>
  );
};

export default AssessmentPage;