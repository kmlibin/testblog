"use client";
import React, { useState } from "react";
import styles from "./createPost.module.css";
import Image from "next/image";
import "react-quill/dist/quill.bubble.css";
import ReactQuill from "react-quill";
import { createBlogPost } from "../actions/posts";

const createPost = ({ categories, error }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");

  console.log(categories);

  function generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/ /g, '-') 
      .replace(/[^\w-]+/g, ''); 
  }

  const handlePublish = async () => {
    // Prepare the post object
    const post = {
        // category: doc(db, "categories", catSlug),
    //   images: images.map(image => ({
    //     path: image.path, // Image file path
    //     url: image.url,   // Image URL
    //   })),
      draft: true, // Draft status (true or false)
      date: new Date(),  // Current timestamp
      title: title,  // Post title from the input
    //   coverImage: {
    //     path: coverImagePath, // Cover image path
    //     url: coverImageUrl,   // Cover image URL
    //   },
      content: value, // Content from React Quill editor
      slug: generateSlug(title), // Generate slug based on title
    //   tags: tagsArray, // Tags from the input field
      views: 0,  // Starting views count
    };
  
    try {
      // Call server action to create post
      const response = await createBlogPost(post); 
      console.log('Post created successfully:', response);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  console.log(catSlug, title, value);
  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Title"
        className={styles.input}
        onChange={(e) => setTitle(e.target.value)}
      />
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
      <div className={styles.editor}>
        <button className={styles.button} onClick={() => setOpen(!open)}>
          <Image src="/plus.png" alt="" width={16} height={16} />
        </button>
        {open && (
          <div className={styles.add}>
            <input
              type="file"
              id="image"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />
            <button className={styles.addButton}>
              <label htmlFor="image">
                <Image src="/image.png" alt="" width={16} height={16} />
              </label>
            </button>
            <button className={styles.addButton}>
              <Image src="/external.png" alt="" width={16} height={16} />
            </button>
            <button className={styles.addButton}>
              <Image src="/video.png" alt="" width={16} height={16} />
            </button>
          </div>
        )}
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
