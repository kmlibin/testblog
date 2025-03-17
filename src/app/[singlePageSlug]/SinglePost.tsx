'use client'
import React from "react";
import Menu from "@/components/menu/Menu";
import styles from "./singlePage.module.css";
import Image from "next/image";
import { BlogPostWithId, BlogPost } from "../types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
type SinglePostProps = {
  blogPostError: string | null;
  blogPost: BlogPostWithId | null ;
};

const SinglePost = ({ blogPostError, blogPost }: SinglePostProps) => {  

    if (blogPostError || !blogPost) {
    return <div className={styles.error}>Error fetching Post...</div>;
  }
console.log(blogPost)
    const {
      title,
      content,
      categoryName,
      category,
      tags,
      date,
      draft,
      coverImage,
      additionalImages,
    } = blogPost?.data;


const formattedDate = date ? new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
}) : "Invalid Date"

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>
            {title}
          </h1>
          <h4 className={styles.catName}>{categoryName}</h4>
          <div className={styles.user}>
            <div className={styles.userImageContainer}>
              <Image src="/p1.jpeg" alt="" fill className={styles.userImage} />
            </div>
            <div className={styles.userTextContainer}>
              <span className={styles.username}>Author Name</span>
              <span className={styles.date}>{formattedDate}</span>
            </div>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <Image alt="" fill src={coverImage? coverImage.url : '/p1.jpeg'} className={styles.image} />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.post}>
          <div className={styles.description}>
        <ReactQuill value={content} readOnly theme={"bubble"}/>
          </div>
        </div>
        <Menu />
      </div>
    </div>
  );
};

export default SinglePost;
