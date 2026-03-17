'use client';

import { CognitiveDistortionForm } from '@/features/dashboard/user/assessments/components/CognitiveDistortion';
import { createCognitiveDistortionAssessment } from '@/features/dashboard/user/cognitiveDistortions/api/cognitiveDistortionClient';
import styles from './CognitiveDistortionsPage.module.css';

export function CognitiveDistortionsPageClient() {
  return (
    <main className={styles.container}>
      <CognitiveDistortionForm onSubmit={createCognitiveDistortionAssessment} />
      <footer className={styles.footer}>
        <p>
          ※この診断は診断を確定させるものではありません。不安な場合は必ず医療機関を受診してください。
        </p>
      </footer>
    </main>
  );
}
