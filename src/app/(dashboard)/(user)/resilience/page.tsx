'use client';

import { ResilienceAssessmentForm } from '@/features/components/assessment/ResilienceAssessment';
import { useCreateResilience } from '@/services/useAssessments';
import styles from './page.module.css';

const ResiliencePage = () => {
  const { create } = useCreateResilience();

  return (
    <main style={{ backgroundColor: '#f7fafc', minHeight: '100vh' }}>
      <ResilienceAssessmentForm onSubmit={create} />
      <footer className={styles.footer}>
        <p>
          ※この診断は診断を確定させるものではありません。不安な場合は必ず医療機関を受診してください。
        </p>
      </footer>
    </main>
  );
};

export default ResiliencePage;
