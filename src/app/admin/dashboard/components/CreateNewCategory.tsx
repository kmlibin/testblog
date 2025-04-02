"use client";
import React from "react";
import styles from "./managecategories.module.css";

import { FaCheck } from "react-icons/fa";
import { RiCloseLargeFill } from "react-icons/ri";
import InputColor from "react-input-color";

type Props = {
  handleNewFile: any;
  setColor: any;
  color: any;
  setIsCreatingNew: any;
};

const CreateNewCategory = ({
  handleNewFile,
  setColor,
  color,
  setIsCreatingNew,
}: Props) => {
  return (
    <div className={styles.newCategoryCard}>
      <div className={styles.imageContainer}>
        <img
          src="/p1.jpeg"
          alt="New Category"
          className={styles.categoryImage}
        />
        <input type="file" onChange={handleNewFile} />
      </div>
      <div className={styles.categoryDetails}>
        <div className={styles.categoryName}>
          <input
            type="text"
            placeholder="Category Name"
            className={styles.inputField}
          />
        </div>

        <div className={styles.colorSection}>
          <div className={styles.colorPickerPlaceholder}>
            <div>
              <InputColor
                initialValue="#5e72e4"
                onChange={setColor}
                placement="right"
              />
              <div
                style={{
                  width: 50,
                  height: 50,
                  marginTop: 10,
                  borderRadius: "50%",
                  backgroundColor: color.hex,
                }}
              />
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <span className={styles.icon}>
            <FaCheck title="Publish New Category" />
          </span>
          <span className={styles.icon} onClick={() => setIsCreatingNew(false)}>
            <RiCloseLargeFill title="close new category" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default CreateNewCategory;
