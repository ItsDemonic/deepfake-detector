import { type InputHTMLAttributes, type ReactNode } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({ label, error, icon, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>{label}</label>
      )}
      <div className={`${styles.inputWrap} ${error ? styles.hasError : ''} ${icon ? styles.hasIcon : ''}`}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          id={inputId}
          className={`${styles.input} ${className}`}
          {...props}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
