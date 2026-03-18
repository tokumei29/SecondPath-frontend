import styles from './RouteLoading.module.css';

export const RouteLoading = () => {
  return (
    <div className={styles.backdrop}>
      <div className={styles.spinner} />
    </div>
  );
};
