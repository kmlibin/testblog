"use client";
import React from "react";
import Menu from "@/components/menu/Menu";
import styles from "./singlePage.module.css";
import Image from "next/image";
import { BlogPostWithId, CategoryWithId } from "@/app/types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { formatDate } from "@/app/utils/formatDate";
import { useAuth } from "@/context/AuthContext";
import EditPostButton from "../../EditPostButton";

type SinglePostProps = {
  blogPostError: string | null;
  blogPost: BlogPostWithId | null;
  myPicks: BlogPostWithId[] | null;
  myPicksError: string | null;
  popularPostsError: string | null;
  popularPosts: BlogPostWithId[] | null;
  categories: CategoryWithId[] | null;
  categoriesError: string | null;
};

const SinglePost = ({
  blogPostError,
  blogPost,
  myPicks,
  myPicksError,
  popularPosts,
  popularPostsError,
  categories,
  categoriesError,
}: SinglePostProps) => {

  const {user} = useAuth()
  if (blogPostError || !blogPost) {
    return <div className={styles.error}>Error fetching Post...</div>;
  }

  const {
    title,
    content,
    categoryName,
    categoryColor,
    category,
    tags,
    date,
    draft,
    editedAt,
    coverImage,
    additionalImages,
  } = blogPost?.data;

  const formattedDate = formatDate(date ? date : null);
  const formattedEditedDate = formatDate(editedAt ? editedAt : null);

  return (
    <div className={styles.container}>
      {user && <EditPostButton draft={blogPost?.data.draft.toString()} postId={blogPost.id} />}
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{title}</h1>
          <h4
            className={styles.catName}
            style={{ backgroundColor: `${categoryColor}` }}
          >
            {categoryName}
          </h4>
          <div className={styles.user}>
            <div className={styles.userImageContainer}>
              <Image src="/p1.jpeg" alt="" fill className={styles.userImage} />
            </div>
            <div className={styles.userTextContainer}>
              <span className={styles.username}>Author Name</span>
              <span className={styles.date}>{formattedDate}</span>
              {editedAt ? (
                <span className={styles.editedAt}>
                  Last Edited: {formattedEditedDate}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <Image
            alt=""
            fill
            src={coverImage ? coverImage.url : "/p1.jpeg"}
            className={styles.image}
          />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.post}>
          <div className={styles.description}>
            <ReactQuill value={content} readOnly theme={"bubble"} />
          </div>
        </div>
        <Menu
          myPicks={myPicks}
          myPicksError={myPicksError}
          popularPosts={popularPosts}
          popularPostsError={popularPostsError}
          categories={categories}
          categoriesError={categoriesError}
        />
      </div>
    </div>
  );
};

export default SinglePost;
