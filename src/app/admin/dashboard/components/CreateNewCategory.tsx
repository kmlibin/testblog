"use client";
import React from "react";
import styles from "./managecategories.module.css";

import { FaCheck } from "react-icons/fa";
import { RiCloseLargeFill, RiPlayReverseMiniFill } from "react-icons/ri";
import InputColor from "react-input-color";
import { uploadImage } from "@/app/utils/uploadImage";
import { createCategory } from "@/app/actions/categories";

type Props = {
  handleNewFile: any;

  setIsCreatingNew: any;
  newCategory: any;
  setNewCategory: any;

};

const CreateNewCategory = ({
  handleNewFile,

  setIsCreatingNew,
  newCategory,
  setNewCategory,

 
}: Props) => {
console.log(newCategory)

  const handlePublishNewCategory = async (e: any) => {
    e.preventDefault();

    try {
      let newCatUrl: { url: string; path: string } | undefined = undefined;
    
        console.log("run new image");
        // upload new image and get url and path
        newCatUrl = await uploadImage(newCategory.image.file);


      //create object that now includes the urls
      const newCat = {
        color: newCategory.color,
        image: newCatUrl,
        name: newCategory.name,
      };

      //call server action, editpost
      const response = await createCategory(newCat);
      //if successful
      if (response?.error === false) {
        const { message } = response;
        console.log("response", response);
        // setLoading(false);
        // setSuccess(true);
        // setModalMessage(message);
        // setShowModal(true);

        //clear state values
        // setEditingCategoryId(null);
        // setEditedCategory(null);
        // setNewImage(null);
      }
      //if unsuccessful
      if (response?.error === true) {
        console.log("error ");
        const { message } = response;
        // setLoading(false);
        // setSuccess(false);
        // setModalMessage(message);
        // setShowModal(true);
        console.log(message);
      }
    } catch (error: any) {
      console.log("error adding product");
      // setLoading(false);
      // setSuccess(false);
      // setModalMessage(error.message);
      // setShowModal(true);
    }
  };
  return (
    <div className={styles.newCategoryCard}>
      <div className={styles.imageContainer}>
        <img
          src={newCategory?.image?.file ? newCategory.image.url : "/p1.jpeg"}
          alt="photo for category"
          className={styles.categoryImage}
        />
        <input type="file" onChange={(e) => handleNewFile(e, true)} />
      </div>
      <div className={styles.categoryDetails}>
        <div className={styles.categoryName}>
          <input
            type="text"
            placeholder="Category Name"
            className={styles.inputField}
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory((prev: any) => ({
                ...prev,
                name: e.target.value
              }))
            }
          />
        </div>

        <div className={styles.colorSection}>
          <div className={styles.colorPickerPlaceholder}>
          
            <div className={styles.colorSection}>
            <p>Select Color</p>
              <InputColor
                initialValue="#5e72e4"
                onChange={(color) =>
                  setNewCategory((prev: any) => ({
                    ...prev,
                    color: color.hex,
                  }))
                }
                placement="right"
              />
              <div
                style={{
                  width: 50,
                  height: 50,
                  marginTop: 10,
                  borderRadius: "50%",
                  backgroundColor: newCategory?.color || null,
                }}
              />
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <span className={styles.icon} onClick={(e) => handlePublishNewCategory(e)}>
            <FaCheck title="Publish New Category" />
          </span>
          <span className={styles.icon} onClick={() => {setIsCreatingNew(false), setNewCategory(null)}}>
            <RiCloseLargeFill title="close new category" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default CreateNewCategory;
