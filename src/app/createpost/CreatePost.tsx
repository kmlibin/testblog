"use client";
import React, { useState, useEffect } from "react";
import styles from "./createPost.module.css";
import { useRouter } from "next/navigation";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { createBlogPost } from "../actions/posts";
import AddImage from "./AddImage";
import { uploadImage } from "../utils/uploadImage";
import { CategoryWithId } from "../types";
import Keywords from "./Keywords";
import generateSlug from "../utils/generateSlug";
import Modal from "@/components/modal/Modal";
import Loading from "@/components/loading/Loading";
import MyPick from "@/components/myPick/MyPick";
import paths from "@/paths";
import DraftSaveButtons from "@/components/draftSaveButtons/draftSaveButtons";

type CreatePostProps = {
  categories: CategoryWithId[] | null;
  error: string | null;
};

type ImageFile = {
  url: string;
  file: File;
};

const createPost = ({ categories, error }: CreatePostProps) => {
  const router = useRouter();
  const [postSlug, setPostSlug]= useState<string>("")
  const [featured, setFeatured] = useState<boolean>(false);
  const [myPick, setMyPick] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [coverImage, setCoverImage] = useState<ImageFile | null>(null);
  const [additionalImages, setAdditionalImages] = useState<ImageFile[]>([]);
  const [title, setTitle] = useState<string>("");
  const [catSlug, setCatSlug] = useState<string>("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [draft, setDraft] = useState<boolean>(false);
  const [newPostId, setNewPostId] = useState<string | null>(null);
  const [returnedStatus, setReturnedStatus] = useState<string>("")

  const MAX_FILE_SIZE = 3 * 1024 * 1024;
  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];

  //upload for the cover photo
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;

    //checks type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert("Invalid file type. Please upload a JPEG or PNG image.");
      return;
    }

    //checks size
    if (file.size > MAX_FILE_SIZE) {
      alert("File is too large. Please upload an image smaller than 3MB.");
    }

    setCoverImage({
      url: URL.createObjectURL(file),
      file: file,
    });
  };

  //uploads for array of images
  const handleAdditionalImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.target.files ? Array.from(e.target.files) : [];

    files.forEach((file) => {
      //checks type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        alert("Invalid file type. Please upload a JPEG or PNG image.");
        return;
      }

      //checks size
      if (file.size > MAX_FILE_SIZE) {
        alert("File is too large. Please upload an image smaller than 3MB.");
      } else {
        const url = URL.createObjectURL(file);
        setAdditionalImages((prevImages) => [...prevImages, { url, file }]);
      }
    });
  };
  //checkbox for my pick
  const handleMyPickChange = () => {
    setMyPick((prev) => !prev);
  };
  //box for featured
  const handleFeaturedChange = () => {
    setFeatured((prev) => !prev);
  };

  //creates blog post in firebase
  const handlePublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    //get image url and path for cover and additional photos
    try {
      const imageUrlsAndPaths = await Promise.all(
        additionalImages.map((image) => uploadImage(image.file))
      );
      const coverUrlAndPath = await uploadImage(coverImage?.file);
      //create object that now includes the urls
      const post = {
        featured: featured,
        myPick: myPick,
        title: title,
        category: catSlug,
        categoryColor: "",
        content: content,
        draft: draft,
        tags: keywords,
        views: 0,
        coverImage: coverUrlAndPath,
        additionalImages: imageUrlsAndPaths,
        slug: generateSlug(title),
      };

      //call server action, create post
      const response = await createBlogPost(post);
      //if successful
      if (response.error === false) {
        
        const { message, error, id, slug, draft } = response;
        setLoading(false);
        setSuccess(true);
        setPostSlug(slug ? slug : "/")
        setReturnedStatus(draft)
        setNewPostId(id);
        setModalMessage(message);
        setShowModal(true);

        //clear state values
        setTitle("");
        setContent("");
        setCoverImage(null);
        setAdditionalImages([]);
        setKeywords([]);
        setDraft(false);
        console.log("success!");
      }
      //if unsuccessful
      if (response.error === true) {
        const { message } = response;
        setLoading(false);
        setSuccess(false);
        setModalMessage(message);
        setShowModal(true);
        console.log("failure");
      }
    } catch (error: any) {
      console.log("error adding product");
      setLoading(false);
      setSuccess(false);
      setModalMessage(error.message);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (success == true && newPostId) {
      router.push(paths.viewSinglePostPage(postSlug, returnedStatus, newPostId));
    }
  };

  return (
    <div className={styles.container}>
      <Loading label="Adding blog to database..." isLoading={loading} />
      <form onSubmit={handlePublish} className={styles.form}>
        {/* //title */}
        <input
          type="text"
          placeholder="Title"
          className={styles.input}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* //categories */}
        {error && (
          <div className={styles.error}>Error fetching sections...</div>
        )}
        {categories !== null && (
          <select
            required
            className={styles.select}
            onChange={(e) => setCatSlug(e.target.value)}
          >
            <option value="">Select a category</option>
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
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Tell your story..."
          />
        </div>
        <Keywords keywords={keywords} setKeywords={setKeywords} />
        <MyPick
          type="featured"
          toggle={featured}
          handleCheckboxChange={handleFeaturedChange}
        />
        <MyPick
          type="myPick"
          toggle={myPick}
          handleCheckboxChange={handleMyPickChange}
        />
        <DraftSaveButtons type="create" loading={loading} setDraft={setDraft} />
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

export default createPost;
