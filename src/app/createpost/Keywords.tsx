"use client";
import React, { useState } from "react";
import styles from "./keywordstyles.module.css";
import { IoMdClose } from "react-icons/io";

type KeywordsProps = {
  keywords: string[];
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
};

const Keywords = ({ keywords, setKeywords }: KeywordsProps) => {
  const [singleKeyword, setSingleKeyword] = useState<string>("");
  const [keywordError, setKeywordError] = useState<string | null>(null);

  const handleAddKeyword = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (singleKeyword.trim() != "") {
    const sanitizedKeyword = singleKeyword.trim().replace(/\s+/g, "-")
    console.log(sanitizedKeyword)
      if (keywords.length >= 8) {
        setKeywordError("Must have fewer than 8 keywords");
        return;
      }
      if (singleKeyword.length > 15) {
        setKeywordError("Keyword cannot exceed 15 characters");
        return;
      }
      if (keywords.includes(singleKeyword)) {
        setKeywordError("You've already used that keyword!");
        return;
      } else {
        setKeywords([...keywords, sanitizedKeyword]);
        setSingleKeyword("");
        setKeywordError(null);
      }
    }
  };

  const handleRemoveKeyword = (index: any) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  return (
    <div className={styles.keywordsContainer}>
      <label className={styles.label}>Keywords (Max 8)</label>
      {keywordError && <p className={styles.keywordError}>{keywordError}</p>}
      {keywords.length >= 1 && (
        <div className={styles.chipWrapper}>
          {keywords.map((keyword, index) => (
            <div key={index} className={styles.chip}>
              {keyword}
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => handleRemoveKeyword(index)}
              >
                <IoMdClose />
              </button>
            </div>
          ))}
        </div>
      )}
      {keywords.length < 8 && (
        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={styles.keywordInput}
            value={singleKeyword}
            onChange={(e) => setSingleKeyword(e.target.value)}
            placeholder="Add a keyword..."
            onKeyDown={handleKeyDown}
          />
          <button className={styles.addButton} onClick={handleAddKeyword}>
            Add Keyword
          </button>
        </div>
      )}
      
    </div>
  );
};

export default Keywords;
