import React from "react";
import styles from "./myPick.module.css";

type MyPickProps = {
  toggle: boolean;
  handleCheckboxChange: () => void;
  type: string;
};

const MyPick = ({ toggle, type, handleCheckboxChange }: MyPickProps) => {
  return (
    <div className={styles.myPickContainer}>
      {!toggle ? (
        <button
          type="button"
          className={styles.addPick}
          onClick={handleCheckboxChange}
        >
          {type === "myPick" ? "Add to My Picks" : "Make Featured Post"}
        </button>
      ) : (
        <div className={styles.pickedWrapper}>
          <span className={styles.pickedChip}>
            ✓ {type === "myPick" ? "My Pick" : "Featured"}
          </span>
          <button
            type="button"
            className={styles.removePick}
            onClick={handleCheckboxChange}
          >
            {type === "myPick"
              ? "Remove from My Picks"
              : "Remove as Featured Post"}
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPick;
