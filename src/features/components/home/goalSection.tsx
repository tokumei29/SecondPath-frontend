import { Profile } from '@/features/types/profile';
import styles from './goalSection.module.css';

type GoalSectionProps = {
  profile: Profile | null;
};

export const GoalSection = ({ profile }: GoalSectionProps) => {
  // 目標リストをレンダリングするヘルパー関数
  const renderGoalList = (goals: string[] | undefined, placeholder: string) => {
    const validGoals = goals?.filter((g) => g.trim() !== '');

    if (!validGoals || validGoals.length === 0) {
      return <p className={styles.goalPlaceholder}>{placeholder}</p>;
    }

    return (
      <div className={styles.goalList}>
        {validGoals.map((goal, index) => (
          <p key={index} className={styles.goalText}>
            ・ {goal}
          </p>
        ))}
      </div>
    );
  };

  return (
    <section className={styles.goalSection}>
      <div className={styles.goalCard}>
        {/* 短期目標 */}
        <div className={styles.goalContent}>
          <span className={styles.goalLabel}>🚩 短期目標</span>
          {renderGoalList(profile?.short_term_goals, '短期目標を設定しましょう')}
        </div>

        <div className={styles.goalDivider} />

        {/* 長期目標 */}
        <div className={styles.goalContent}>
          <span className={styles.goalLabel}>🏆 長期目標</span>
          {renderGoalList(profile?.long_term_goals, '長期目標を設定しましょう')}
        </div>
      </div>
    </section>
  );
};
