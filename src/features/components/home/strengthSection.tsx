import { Profile } from '@/features/types/profile';
import styles from './strengthSection.module.css';

type StrengthSectionProps = {
  profile: Profile | null;
};

export const StrengthSection = ({ profile }: StrengthSectionProps) => {
  // リストをレンダリングするヘルパー関数
  const renderList = (items: string[] | undefined, placeholder: string) => {
    const validItems = items?.filter((item) => item.trim() !== '');

    if (!validItems || validItems.length === 0) {
      return <p className={styles.placeholder}>{placeholder}</p>;
    }

    return (
      <div className={styles.list}>
        {validItems.map((item, index) => (
          <p key={index} className={styles.text}>
            ・ {item}
          </p>
        ))}
      </div>
    );
  };

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        {/* 強みセクション */}
        <div className={styles.content}>
          <span className={styles.label}>💎 自分の強み</span>
          {renderList(profile?.strengths, '自分の強みを言語化しましょう')}
        </div>

        <div className={styles.divider} />

        {/* 弱み・克服セクション */}
        <div className={styles.content}>
          <span className={styles.label}>🔧 克服したいこと</span>
          {renderList(profile?.weaknesses, '課題を整理しましょう')}
        </div>
      </div>
    </section>
  );
};
