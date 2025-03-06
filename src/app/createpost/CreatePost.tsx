"use client";
import React, { useState } from "react";
import styles from "./createPost.module.css";


import "react-quill/dist/quill.bubble.css";
import ReactQuill from "react-quill";
import { createBlogPost } from "../actions/posts";
import AddImage from "./AddImage";
import { uploadImage } from "../utils/uploadImage";
import { CategoryWithId, BlogPost } from "../types";

type CreatePostProps = {
  categories: CategoryWithId[] | null;
  error: string | null;
}

type ImageFile = {
  url: string;
  file: File;
};


const createPost = ({ categories, error }: CreatePostProps) => {
  const [value, setValue] = useState<string>("");
  const [coverImage, setCoverImage] = useState<ImageFile | null>(null);
  const [additionalImages, setAdditionalImages] = useState<ImageFile[]>([]);
  const [title, setTitle] = useState<string>("");
  const [catSlug, setCatSlug] = useState<string>("");


  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;
    setCoverImage({
      url: URL.createObjectURL(file),
      file: file,
    });

  };

  const handleAdditionalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setAdditionalImages((prevImages) => [
      ...prevImages,
      ...files.map((file) => ({ url: URL.createObjectURL(file), file })),
    ]);
  };

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  const handlePublish = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
        const imageUrlsAndPaths = await Promise.all(additionalImages.map((image) =>uploadImage(image.file)))
        const coverUrlAndPath = await uploadImage(coverImage?.file)
 
    const post = {
      category: catSlug,
      draft: false, // Draft status (true or false)
      date: new Date(), // Current timestamp
      title: title, // Post title from the input
      coverImage: coverUrlAndPath,
      additionalImages: imageUrlsAndPaths,
      content: value, // Content from React Quill editor
      slug: generateSlug(title), // Generate slug based on title
      tags: ["test", "of", "keywords"],
      views: 0, // Starting views count
    };


      // Call server action to create post
      const response = await createBlogPost(post);
      console.log("Post created successfully:", response);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  console.log(catSlug, title, value, coverImage, additionalImages);
  return (
    <div className={styles.container}>
      {/* //title */}
      <input
        type="text"
        placeholder="Title"
        className={styles.input}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* //categories */}
      {error && <div className={styles.error}>Error fetching sections...</div>}
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
          value={value}
          onChange={setValue}
          placeholder="Tell your story..."
        />
      </div>
      <button className={styles.publish} onClick={handlePublish}>
        Publish
      </button>
    </div>
  );
};

export default createPost;
