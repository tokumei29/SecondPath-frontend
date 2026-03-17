'use client';

import { createResilienceAssessment } from '@/api/assessments';
import { ResilienceAssessmentForm } from '@/features/components/assessment/ResilienceAssessment';
import styles from './page.module.css';

const ResiliencePage = () => {
  return (
    <main style={{ backgroundColor: '#f7fafc', minHeight: '100vh' }}>
      <ResilienceAssessmentForm onSubmit={createResilienceAssessment} />
      <footer className={styles.footer}>
        <p>
          ※この診断は診断を確定させるものではありません。不安な場合は必ず医療機関を受診してください。
        </p>
      </footer>
    </main>
  );
};

export default ResiliencePage;
