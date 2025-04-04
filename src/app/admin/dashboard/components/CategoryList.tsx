"use client";

import { CategoryWithId } from "@/app/types";
import React, { useState } from "react";
import styles from "./managecategories.module.css";
//icons and libraries
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import { ImageFile } from "@/app/types";

import InputColor from "react-input-color";

type Props = {
  categories: CategoryWithId[];

  editingCategoryId: string | null;
  setNewImage: React.Dispatch<React.SetStateAction<ImageFile | null>>;
  setEditingCategoryId: React.Dispatch<React.SetStateAction<string | null>>;
  newImage: ImageFile | null;

  handleNewFile: (
    e: React.ChangeEvent<HTMLInputElement>,
    cover: boolean
  ) => void;
  editedCategory: CategoryWithId | null;

  setEditedCategory: React.Dispatch<
    React.SetStateAction<CategoryWithId | null>
  >;

  handlePublishChanges: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => Promise<void>;
  handleDeleteCategory: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    category: CategoryWithId
  ) => Promise<void>;
};

const CategoryList = ({
  setNewImage,
  handleDeleteCategory,
  handlePublishChanges,
  categories,
  setEditedCategory,

  editingCategoryId,
  setEditingCategoryId,
  newImage,
  handleNewFile,
  editedCategory,
}: Props) => {
  const [color, setColor] = useState<{ hex: string }>({ hex: "#0000ff" });
  const [categoryImages, setCategoryImages] = useState<{ [key: string]: any }>(
    {}
  );
  const handleColorChange = (color: any) => {
    // Update only the color of the edited category
    setEditedCategory((prev) => {
      if (prev) {
        return {
          ...prev,
          color: color.hex, // Update the color for the edited category
        };
      }
      return prev;
    });
  };

  const handleEditClick = (categoryId: string) => {
    setEditingCategoryId(categoryId);
    const category = categories.find((cat) => cat.id === categoryId);
    setEditedCategory(category || null);
    // Reset image for the new category being edited
    setNewImage(categoryImages[categoryId] || null);
    if (category) {
      setColor({ hex: category.color });
    }
  };

  const handleInputChange = (field: keyof CategoryWithId, value: any) => {
    setEditedCategory((prev) => {
      if (prev) {
        // Ensure the 'id' field is retained and other fields are updated
        return {
          ...prev, // Preserve other fields
          [field]: value, // Update only the changed field
        };
      }
      return prev; // If prev is null, return it as is
    });
  };

  return (
    <>
      {categories.map((category) => (
        <div className={styles.categoryCard} key={category.id}>
          {editingCategoryId === category.id && (
            <div className={styles.buttonContainer}>
              <button
                className={styles.exitButton}
                onClick={() => setEditingCategoryId(null)}
              >
                Exit Edit
              </button>
            </div>
          )}
          <div className={styles.infoContainer}>
            {/* image with upload button when editing */}
            <div className={styles.imageContainer}>
              <img
                src={
                  newImage && editingCategoryId === category.id
                    ? newImage.url
                    : categoryImages[category.id]?.url || category?.image?.url
                }
                alt={category.name}
                className={styles.categoryImage}
              />
              {editingCategoryId === category.id && (
                <input type="file" onChange={(e) => handleNewFile(e, false)} />
              )}
            </div>
            <div className={styles.categoryDetails}>
              {/* editable cat name */}
              <div className={styles.categoryName}>
                {editingCategoryId === category.id ? (
                  <input
                    type="text"
                    className={styles.inputField}
                    value={editedCategory?.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                ) : (
                  <h4>{category.name}</h4>
                )}
              </div>

              {/* color, shown only when editing */}
              <div className={styles.colorSection}>
                {editingCategoryId === category.id && <p>Select Color</p>}
                {editingCategoryId === category.id && (
                  <InputColor
                    initialValue={category.color}
                    onChange={(color) => handleColorChange(color)}
                  />
                )}
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    backgroundColor:
                      editedCategory?.id === category.id
                        ? editedCategory.color
                        : category.color, // Only show edited category's color
                  }}
                />
              </div>

              {/* buttons */}
              <div className={styles.actionButtons}>
                {editingCategoryId === category.id ? (
                  <span
                    className={styles.icon}
                    onClick={(e) => handlePublishChanges(e)}
                  >
                    <FaCheck title="Save Changes" />
                  </span>
                ) : (
                  <span
                    className={styles.icon}
                    onClick={() => handleEditClick(category.id)}
                  >
                    <FaEdit title="Edit" />
                  </span>
                )}

                <span
                  className={styles.icon}
                  onClick={(e) => handleDeleteCategory(e, category)}
                >
                  <FaTrash title="Delete" />
                </span>
              </div>
            </div>
            <div className={styles.countContainer}>
              <p>Posts: {category?.posts ? category.posts.length : "0"}</p>
              <p>Drafts: {category?.drafts ? category.drafts.length : "0"}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CategoryList;
