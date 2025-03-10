"use client";
import React, { useState } from "react";
import styles from "./createPost.module.css";

import "react-quill/dist/quill.bubble.css";
import ReactQuill from "react-quill";
import { createBlogPost } from "../actions/posts";
import AddImage from "./AddImage";
import { uploadImage } from "../utils/uploadImage";
import { CategoryWithId, BlogPost } from "../types";
import Keywords from "./Keywords";
import { MdUpload } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";

type CreatePostProps = {
  categories: CategoryWithId[] | null;
  error: string | null;
};

type ImageFile = {
  url: string;
  file: File;
};

const createPost = ({ categories, error }: CreatePostProps) => {
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


  //upload for the cover photo
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImage({
      url: URL.createObjectURL(file),
      file: file,
    });
  };

  //uploads for array of images
  const handleAdditionalImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setAdditionalImages((prevImages) => [
      ...prevImages,
      ...files.map((file) => ({ url: URL.createObjectURL(file), file })),
    ]);
  };

  //creates the slug
  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

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
        title: title,
        category: catSlug,
        content: content,
        draft: draft,
        tags: keywords,
        views: 0,
        date: new Date(),
        coverImage: coverUrlAndPath,
        additionalImages: imageUrlsAndPaths,
        slug: generateSlug(title),
      };

      //call server action, create post
      const { error, message } = await createBlogPost(post);
      //if successful
      if (error === false) {
        setLoading(false);
        setSuccess(true);
        setModalMessage(message);
        setShowModal(true);
        console.log("success!");
      }
      //if unsuccessful
      if (error === true) {
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

  console.log(catSlug, title, content, coverImage, additionalImages, keywords);
  return (
    <div className={styles.container}>
      <form onSubmit={handlePublish} className={styles.form}>
        {/* //title */}
        <input
          type="text"
          placeholder="Title"
          className={styles.input}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* //categories */}
        {error && (
          <div className={styles.error}>Error fetching sections...</div>
        )}
        {categories !== null && (
          <select
            className={styles.select}
            onChange={(e) => setCatSlug(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
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
            placeholder="Tell your story..."
          />
        </div>
        <Keywords keywords={keywords} setKeywords={setKeywords} />
        <div className={styles.buttons}>
          <button className={styles.publish}>
            Publish
            <MdUpload />
          </button>
          <button onClick={() => setDraft(true)} className={styles.draft}>
            Save as Draft
            <FaRegSave />
          </button>
        </div>
      </form>
    </div>
  );
};

export default createPost;
