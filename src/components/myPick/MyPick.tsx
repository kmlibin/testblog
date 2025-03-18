import React from "react";
import styles from './myPick.module.css'

type MyPickProps = {
myPick: boolean;
handleCheckboxChange: () => void;
};

const MyPick = ({myPick, handleCheckboxChange}: MyPickProps) => {
  return (
    <div className={styles.myPickContainer}>
    {!myPick ? (
        <button type="button" className={styles.addPick} onClick={handleCheckboxChange}>
          Add to My Picks
        </button>
      ) : (
        <div className={styles.pickedWrapper}>
          <span className={styles.pickedChip}>✓ My Pick</span>
          <button type="button" className={styles.removePick} onClick={handleCheckboxChange}>
            Remove from My Picks
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPick;
