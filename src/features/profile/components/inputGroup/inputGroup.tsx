'use client';

import React from 'react';
import styles from './inputGroup.module.css';

type InputGroupProps = {
  title: string;
  values: string[];
  onFieldChange: (index: number, value: string) => void;
};

export const InputGroup = ({ title, values, onFieldChange }: InputGroupProps) => {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.inputList}>
        {values.map((val, idx) => (
          <input
            key={idx}
            className={styles.input}
            value={val}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onFieldChange(idx, e.target.value)
            }
            placeholder={`${idx + 1}.`}
          />
        ))}
      </div>
    </section>
  );
};
