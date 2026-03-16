'use client';

import { CognitiveDistortionForm } from '@/features/components/assessment/CognitiveDistortion';
import { useCreateCognitiveDistortion } from '@/services/useAssessments';
import styles from './page.module.css';

const CognitiveDistortionPage = () => {
  const { create } = useCreateCognitiveDistortion();

  return (
    <main className={styles.container}>
      <CognitiveDistortionForm onSubmit={create} />
      <footer className={styles.footer}>
        <p>
          ※この診断は診断を確定させるものではありません。不安な場合は必ず医療機関を受診してください。
        </p>
      </footer>
    </main>
  );
};

export default CognitiveDistortionPage;
