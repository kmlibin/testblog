"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal/Modal";
import Loading from "@/components/loading/Loading";
import styles from "./edit.module.css";
import { BlogPostWithId, CategoryWithId } from "@/app/types";
import { uploadImage } from "@/app/utils/uploadImage";
import AddImage from "@/app/createpost/AddImage";
import "react-quill/dist/quill.bubble.css";
import ReactQuill from "react-quill";
import { MdUpload } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import Keywords from "@/app/createpost/Keywords";

type EditPostProps = {
  categories: CategoryWithId[] | null;
  categoriesError: string | null;
  blogPostError: string | null;
  blogPost: BlogPostWithId | null;
};

type ImageFile = {
  url: string;
  file: File;
};

type Props = {};

const Edit = ({
  categories,
  blogPostError,
  categoriesError,
  blogPost,
}: EditPostProps) => {
  const router = useRouter();

  const [showCategoryErrorModal, setShowCategoryErrorModal] =
    useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [content, setContent] = useState<string>(blogPost?.data?.content || "");
  const [coverImage, setCoverImage] = useState<ImageFile | null>(null);
  const [additionalImages, setAdditionalImages] = useState<ImageFile[]>([]);
  const [title, setTitle] = useState<string>(blogPost?.data.title || "");
  const [catSlug, setCatSlug] = useState<string>();
  const [keywords, setKeywords] = useState<string[]>(
    blogPost?.data?.tags || []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [draft, setDraft] = useState<boolean>(blogPost?.data?.draft || false);


  useEffect(() => {
    const initialCategoryId =
      categories?.find((cat) => cat.name === blogPost?.data.category)?.id || "";
    setCatSlug(initialCategoryId);
  }, [blogPost, categories]);

  console.log(blogPost);
  const MAX_FILE_SIZE = 3 * 1024 * 1024;

  //upload for the cover photo
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert("File is too large. Please upload an image smaller than 3MB.");
      }
    } else {
      setCoverImage({
        url: URL.createObjectURL(file),
        file: file,
      });
    }
  };

  //uploads for array of images
  const handleAdditionalImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.target.files ? Array.from(e.target.files) : [];

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert("File is too large. Please upload an image smaller than 3MB.");
      } else {
        const url = URL.createObjectURL(file);
        setAdditionalImages((prevImages) => [...prevImages, { url, file }]);
      }
    });
  };

  //creates the slug
  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  //creates blog post in firebase
  //   const handlePublish = async (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     setLoading(true);

  //       //if successful
  //       if (response.error === false) {
  //         const { message, error, id } = response;
  //         setLoading(false);
  //         setSuccess(true);
  //         setModalMessage(message);
  //         setShowModal(true);
  //         setNewPostId(id);

  //         //clear state values
  //         setTitle("");
  //         setContent("");
  //         setCoverImage(null);
  //         setAdditionalImages([]);
  //         setKeywords([]);
  //         setDraft(false);
  //         console.log("success!");
  //       }
  //       //if unsuccessful
  //       if (response.error === true) {
  //         const { message } = response;
  //         setLoading(false);
  //         setSuccess(false);
  //         setModalMessage(message);
  //         setShowModal(true);
  //         console.log("failure");
  //       }
  //     } catch (error: any) {
  //       console.log("error adding product");
  //       setLoading(false);
  //       setSuccess(false);
  //       setModalMessage(error.message);
  //       setShowModal(true);
  //     }
  //   };

  const closeModal = () => {
    setShowModal(false);
    if (success == true) {
      router.push("/");
    }
  };

  //if blogpost error, return and display error on frontend
  console.log(blogPostError);
  if (blogPostError) {
    return <div className={styles.error}>Error fetching Post...</div>;
  }

  return (
    <div className={styles.container}>
      <Loading label="Adding blog to database..." isLoading={loading} />
      <form className={styles.form}>
        {/* //title */}
        <input
          type="text"
          placeholder={title}
          className={styles.input}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {draft && <p className={styles.showDraft}>DRAFT</p>}

        {/* //categories */}
        {categoriesError && (
          <div className={styles.error}>Error fetching sections...</div>
        )}
        {categories !== null && (
          <select
            required
            className={styles.select}
            onChange={(e) => setCatSlug(e.target.value)}
            value={catSlug}
          >
            <option disabled value="">
              Select Category
            </option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
        {/* Photo Uploads */}
        <AddImage
          handleCoverImageUpload={handleCoverImageUpload}
          handleAdditionalImageUpload={handleAdditionalImageUpload}
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          additionalImages={additionalImages}
          setAdditionalImages={setAdditionalImages}
        />

        <div className={styles.editor}>
          <ReactQuill
            className={styles.textArea}
            theme="bubble"
            value={content}
            onChange={setContent}
          />
        </div>
        <Keywords keywords={keywords} setKeywords={setKeywords} />
        <div className={styles.buttons}>
          <button type="submit" className={styles.publish} disabled={loading}>
            Publish
            <MdUpload />
          </button>
          <button
            type="submit"
            disabled={loading}
            onClick={() => setDraft(true)}
            className={styles.draft}
          >
            Save as Draft
            <FaRegSave />
          </button>
        </div>
      </form>
      <Modal show={showModal} onClose={closeModal}>
        <div>
          <p>{modalMessage}</p>
        </div>
      </Modal>
      {/* <Modal show={showCategoryErrorModal} onClose={closeCategoryModal}>
      <div>
        <p>{addCategoryError}</p>
      </div>
    </Modal> */}
    </div>
  );
};

export default Edit;
