'use client';

import styles from './InputGroup.module.css';

type InputGroupProps = {
  title: string;
  values: string[];
  onFieldChange: (_index: number, _value: string) => void;
};

export const InputGroup = ({ title, values, onFieldChange }: InputGroupProps) => {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.inputList}>
        {values.map((v, i) => (
          <input
            maxLength={100}
            key={i}
            className={styles.input}
            value={v}
            onChange={(e) => onFieldChange(i, e.target.value)}
            placeholder={`${i + 1}.`}
          />
        ))}
      </div>
    </section>
  );
};
