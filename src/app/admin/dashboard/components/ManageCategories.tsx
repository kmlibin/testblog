"use client";
import React, { useState } from "react";
import styles from "./managecategories.module.css";
import { CategoryWithId } from "@/app/types";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import { RiCloseLargeFill } from "react-icons/ri";
import InputColor from "react-input-color";
import CreateNewCategory from "./CreateNewCategory";
import { uploadImage } from "@/app/utils/uploadImage";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/app/firebase/config";
import { editCategory, deleteCategory } from "@/app/actions/categories";
import Modal from "@/components/modal/Modal";
import { useRouter } from "next/navigation";

import paths from "@/paths";

type Props = {
  categories: CategoryWithId[] | null;
};

const ManageCategories = ({ categories: initialCategories }: Props) => {
  const router = useRouter();
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newImage, setNewImage] = useState<any>(null);
  const [newCatImage, setNewCatImage] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "",
    image: {
      url: null,
      file: null,
    },
  });
  const [categories, setCategories] = useState<CategoryWithId[]>(
    initialCategories || []
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [color, setColor] = useState<any>({ hex: "#0000ff" });
  const [success, setSuccess] = useState<boolean>(false);
  const [categoryImages, setCategoryImages] = useState<{ [key: string]: any }>(
    {}
  );
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editedCategory, setEditedCategory] = useState<CategoryWithId | null>(
    null
  );

  const closeModal = () => {
    console.log("runs");
    setShowModal(false);
    setIsModalOpen(false);
    if (success === true) {
      router.push(paths.adminPage());
    }
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

  const MAX_FILE_SIZE = 3 * 1024 * 1024;
  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];

  const handleNewFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    cover: boolean
  ) => {
    console.log("New file selected:", e.target.files?.[0]);
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;

    //checks file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert("Invalid file type. Please upload a JPEG or PNG image.");
      return;
    }
    //checks file size
    if (file.size > MAX_FILE_SIZE) {
      alert("File is too large. Please upload an image smaller than 3MB.");
      return;
    }

    console.log("works");
    if (cover) {
      setNewCategory((prev: any) => ({
        ...prev,
        image: {
          url: URL.createObjectURL(file),
          file: file,
        },
      }));
    } else {
      setNewImage({
        url: URL.createObjectURL(file),
        file: file,
      });
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

  const handlePublishChanges = async (e: any) => {
    e.preventDefault();

    try {
      let newCoverUrl: { url: string; path: string } | undefined = undefined;
      if (newImage) {
        console.log("run new image");
        // upload new image and get their URLs and paths

        newCoverUrl = await uploadImage(newImage.file);

        if (newCoverUrl) {
          const isFirebaseUrl =
            editedCategory?.image?.url?.includes("firebase") ?? false;
          if (isFirebaseUrl) {
            const imagePath = editedCategory?.image?.path;
            if (imagePath) {
              const imageRef = ref(storage, imagePath);
              deleteObject(imageRef).then(() => {
                console.log("Deleted Google Storage photo");
              });
            }
          }
        }
      }
      //create object that now includes the urls
      const newCat = {
        id: editedCategory?.id,
        color: editedCategory?.color,
        image: newCoverUrl || null,
        name: editedCategory?.name,
      };

      //call server action, editpost
      const response = await editCategory(newCat);
      //if successful
      if (response?.error === false) {
        const { message } = response;
        console.log("response", response);
        // setLoading(false);
        setSuccess(true);
        setModalMessage(message);
        setShowModal(true);

        //clear state values
        setEditingCategoryId(null);
        setEditedCategory(null);
        setNewImage(null);
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
      setSuccess(false);
      setModalMessage(error.message);
      setShowModal(true);
    }
  };

  const handleDeleteCategory = async (e: any, category: any) => {
    e.preventDefault();
    if (category.posts?.length >= 1 || category.drafts?.length >= 1) {
      setSuccess(false);
      setModalMessage(
        "Cannot delete a category that has active posts and/or drafts attached to it."
      );
      setShowModal(true);
      return;
    }

    try {
      const response = await deleteCategory(category);
      //if successful
      if (response?.error === false) {
        const { message } = response;
        console.log("response", response);
        // setLoading(false);
        setSuccess(true);
        setModalMessage(message);
        setShowModal(true);
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
      setSuccess(false);
      setModalMessage(error.message);
      setShowModal(true);
    }
  };

  return (
    <div>
      {/* Manage Categories Button */}
      <button
        className={styles.manageButton}
        onClick={() => setIsModalOpen(true)}
      >
        Manage Categories
      </button>

      {/* overlay */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setIsModalOpen(false)}
            >
              <RiCloseLargeFill />
            </button>
            <h2>Manage Categories</h2>

            {/* new category button*/}
            <button
              className={styles.createCategory}
              onClick={() => setIsCreatingNew(true)}
            >
              Create New Category
            </button>

            {/*show the new category UI when button is clicked */}
            {isCreatingNew && (
              <CreateNewCategory
                setIsCreatingNew={setIsCreatingNew}
                handleNewFile={handleNewFile}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
                setIsModalOpen={setIsModalOpen}
              />
            )}

            {/* existing categories */}
            {categories.map((category) => (
              <div key={category.id} className={styles.categoryCard}>
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
                          : categoryImages[category.id]?.url ||
                            category?.image?.url
                      }
                      alt={category.name}
                      className={styles.categoryImage}
                    />
                    {editingCategoryId === category.id && (
                      <input
                        type="file"
                        onChange={(e) => handleNewFile(e, false)}
                      />
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
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
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
                    <p>
                      Posts: {category?.posts ? category.posts.length : "0"}
                    </p>
                    <p>
                      Drafts: {category?.drafts ? category.drafts.length : "0"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* success or error modal */}
      <Modal show={showModal} onClose={closeModal}>
        <div>
          <p>{modalMessage}</p>
        </div>
      </Modal>
    </div>
  );
};

export default ManageCategories;
