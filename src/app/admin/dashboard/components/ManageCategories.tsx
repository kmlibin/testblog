"use client";
import React, { useState } from "react";
//styles
import styles from "./managecategories.module.css";
//types
import { CategoryWithId } from "@/app/types";
//icons and libraries
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import { RiCloseLargeFill } from "react-icons/ri";
import InputColor from "react-input-color";
//components
import CreateNewCategory from "./CreateNewCategory";
import Modal from "@/components/modal/Modal";
//utils
import { uploadImage } from "@/app/utils/uploadImage";
//firebase
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/app/firebase/config";
//actions
import { editCategory, deleteCategory } from "@/app/actions/categories";
//navigation
import { useRouter } from "next/navigation";
import paths from "@/paths";
//types
import { ImageFile } from "@/app/types";
import CategoryList from "./CategoryList";

type EditedCategory = {
  name: string;
  color: string;
  image: {
    url: null | string;
    file: null | ImageFile;
  };
};

type Props = {
  categories: CategoryWithId[] | null;
};

const ManageCategories = ({ categories: initialCategories }: Props) => {
  const router = useRouter();
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newImage, setNewImage] = useState<ImageFile | null>(null);
  const [newCategory, setNewCategory] = useState<EditedCategory>({
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
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  const [success, setSuccess] = useState<boolean>(false);

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editedCategory, setEditedCategory] = useState<CategoryWithId | null>(
    null
  );

  //closes modal
  const closeModal = () => {
    console.log("runs");
    setShowModal(false);
    setIsModalOpen(false);
    if (success === true) {
      router.push(paths.adminPage());
    }
  };

  const MAX_FILE_SIZE = 3 * 1024 * 1024;
  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];

  //handles files for create and edit, keep here
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

  const handlePublishChanges = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      let newCoverUrl: { url: string; path: string } | undefined = undefined;
      if (newImage) {
        console.log("run new image");
        // upload new image and get their URLs and paths
        newCoverUrl = await uploadImage(newImage.file);
        //upload needs to stay frontend for some reason, throws errors otherwise. but maybe move this to
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
        setEditingCategoryId(null);
        setEditedCategory(null);
        setSuccess(false);
        setModalMessage(message);
        setShowModal(true);
        console.log(message);
      }
    } catch (error: any) {
      console.log("error adding product");
      // setLoading(false);
      setEditingCategoryId(null);
      setEditedCategory(null);
      setSuccess(false);
      setModalMessage(error.message);
      setShowModal(true);
    }
  };

  const handleDeleteCategory = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    category: CategoryWithId
  ) => {
    e.preventDefault();
    //check if there are posts attached to it, return if so
    if (category.posts) {
      if (category.posts?.length >= 1) {
        setSuccess(false);
        setModalMessage(
          "Cannot delete a category that has active posts attached to it."
        );
        setShowModal(true);
        return;
      }
    }
    //check if there are drafts attached to it, return if so
    if (category.drafts) {
      if (category.drafts?.length >= 1) {
        setSuccess(false);
        setModalMessage(
          "Cannot delete a category that has drafts attached to it."
        );
        setShowModal(true);
        return;
      }
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
            <CategoryList
              setNewImage={setNewImage}
              handleDeleteCategory={handleDeleteCategory}
              handlePublishChanges={handlePublishChanges}
              categories={categories}
              setEditedCategory={setEditedCategory}
              editingCategoryId={editingCategoryId}
              setEditingCategoryId={setEditingCategoryId}
              newImage={newImage}
              handleNewFile={handleNewFile}
              editedCategory={editedCategory}
            />
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
