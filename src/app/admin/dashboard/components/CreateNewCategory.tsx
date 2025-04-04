"use client";
import React, { useState } from "react";
//styles
import styles from "./managecategories.module.css";
//icons and libraries
import { FaCheck } from "react-icons/fa";
import { RiCloseLargeFill } from "react-icons/ri";
import InputColor from "react-input-color";
//utils
import { uploadImage } from "@/app/utils/uploadImage";
//actions
import { createCategory } from "@/app/actions/categories";
//components
import Modal from "@/components/modal/Modal";
//navigation
import { useRouter } from "next/navigation";
import paths from "@/paths";
//types
import { ImageFile } from "@/app/types";

type EditedCategory = {
  name: string;
  color: string;
  image: {
    url: null | string;
    file: null | ImageFile;
  };
};

type Props = {
  handleNewFile: (
    e: React.ChangeEvent<HTMLInputElement>,
    cover: boolean
  ) => void;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreatingNew: React.Dispatch<React.SetStateAction<boolean>>;
  newCategory: EditedCategory | null | undefined;
  setNewCategory: any;
};

const CreateNewCategory = ({
  handleNewFile,
  setIsModalOpen,
  setIsCreatingNew,
  newCategory,
  setNewCategory,
}: Props) => {
  const [modalMessage, setModalMessage] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  //close error/success modal
  const closeModal = () => {
    console.log("runs");
    setShowModal(false);
    setIsModalOpen(false);
    if (success === true) {
      router.push(paths.adminPage());
    }
  };

  const handlePublishNewCategory = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();

    try {
      let newCatUrl: { url: string; path: string } | undefined = undefined;

      console.log("run new image");
      // upload new image and get url and path
      newCatUrl = await uploadImage(newCategory?.image.file);

      //create object that now includes the urls
      const newCat = {
        color: newCategory?.color,
        image: newCatUrl,
        name: newCategory?.name,
      };

      //call server action, editpost
      const response = await createCategory(newCat);
      //if successful
      if (response?.error === false) {
        const { message } = response;
        console.log("response", response);
        // setLoading(false);
        setSuccess(true);
        setModalMessage(message);
        setShowModal(true);

        //clear state values
        setNewCategory(null);
      }
      //if unsuccessful
      if (response?.error === true) {
        console.log("error ");
        const { message } = response;
        // setLoading(false);
        setSuccess(false);
        setModalMessage(message);
        setShowModal(true);
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
          src={newCategory?.image?.url ?? "/p1.jpeg"}
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
            value={newCategory?.name}
            onChange={(e) =>
              setNewCategory((prev: EditedCategory) => ({
                ...prev,
                name: e.target.value,
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
                  backgroundColor: newCategory?.color || "#fff",
                }}
              />
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <span
            className={styles.icon}
            onClick={(e) => handlePublishNewCategory(e)}
          >
            <FaCheck title="Publish New Category" />
          </span>
          <span
            className={styles.icon}
            onClick={() => {
              setIsCreatingNew(false), setNewCategory(null);
            }}
          >
            <RiCloseLargeFill title="close new category" />
          </span>
        </div>
      </div>
      {/* success or error modal */}
      <Modal show={showModal} onClose={closeModal}>
        <div>
          <p>{modalMessage}</p>
        </div>
      </Modal>
    </div>
  );
};

export default CreateNewCategory;
