import React from 'react';
import styles from './DiaryField.module.css';

type DiaryFieldProps = {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isMain?: boolean;
};

export const DiaryField = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  isMain = false,
}: DiaryFieldProps) => {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.textarea} ${isMain ? styles.mainTextarea : styles.smallTextarea}`}
        maxLength={isMain ? 1000 : 500}
      />
    </div>
  );
};
