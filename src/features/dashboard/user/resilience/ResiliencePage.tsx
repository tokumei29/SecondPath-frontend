'use client';

import { ResilienceAssessmentForm } from '@/features/dashboard/user/assessments/components/ResilienceAssessment';
import { createResilienceAssessment } from '@/features/dashboard/user/resilience/api/resilienceClient';
import styles from './ResiliencePage.module.css';

export function ResiliencePageClient() {
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
}
