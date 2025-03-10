import React from 'react'
import styles from './loading.module.css'
interface LoadingProps {
  isLoading: boolean;
  label: string;
}

const Loading = ({ isLoading, label }: LoadingProps) => {
    return isLoading ? (
        <div className={styles.container}>
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinner}></div>
            <p className={styles.label}>{label}</p>
          </div>
        </div>
      ) : null;
    };

export default Loading;