'use client';

import { PHQ9Assessment } from '@/features/components/assessment/PHQ9Assessment';
import styles from './page.module.css';

export default function AssessmentPage() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>セルフケア・アセスメント</h1>
        <p className={styles.description}>
          現在のあなたの心の状態を、医学的な指標（PHQ-9）に基づいて客観的に把握します。
          <br />
        </p>
      </header>

      <section className={styles.content}>
        <PHQ9Assessment />
      </section>

      <footer className={styles.footer}>
        <p>
          ※この診断は診断を確定させるものではありません。不安な場合は必ず医療機関を受診してください。
        </p>
      </footer>
    </main>
  );
}
