"use client";
import React, { useState } from "react";
import styles from "./createPost.module.css";

  import { useEffect } from "react";
import "react-quill/dist/quill.bubble.css";
import ReactQuill from "react-quill";
import { createBlogPost } from "../actions/posts";
import AddImage from "./AddImage";
import { uploadImage } from "../utils/uploadImage";


const createPost = ({ categories, error }) => {

  const [value, setValue] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");


useEffect(() => {
  if (coverImage) {
    console.log(coverImage.file);  // This will log when coverImage state is updated
  }
}, [coverImage]);

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    setCoverImage({
      url: URL.createObjectURL(file),
      file: file,
    });

  };

  const handleAdditionalImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setAdditionalImages((prevImages) => [
      ...prevImages,
      ...files.map((file) => ({ url: URL.createObjectURL(file), file })),
    ]);
  };

  function generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  const handlePublish = async (e) => {
    e.preventDefault()
    try {
        const imageUrlsAndPaths = await Promise.all(additionalImages.map((image) =>uploadImage(image.file)))
        const coverUrlAndPath = await uploadImage(coverImage.file)
 
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
