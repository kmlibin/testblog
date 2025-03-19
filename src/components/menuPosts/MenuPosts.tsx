import React from "react";
import styles from "./menuPosts.module.css";
import Link from "next/link";
import Image from "next/image";
import { BlogPostWithId } from "@/app/types";
import paths from "@/paths";
import { formatDate } from "@/app/utils/formatDate";

type MenuPostsProps = {
  withImage?: any;
  error: string | null;
  posts: BlogPostWithId[] | null;
};
const MenuPosts = ({ withImage, error, posts }: MenuPostsProps) => {
  if (error) {
    return <div>Error fetching posts</div>;
  }
  return (
    <div className={styles.items}>
      {posts?.map((post) => (
        <Link
          href={paths.viewSinglePostPage(post.data.slug, post.id)}
          className={styles.item}
        >
          {withImage && (
            <div className={styles.imageContainer}>
              <Image
                src={post?.data?.coverImage?.url || "/p1.jpeg"}
                alt=""
                fill
                className={styles.image}
              />
            </div>
          )}
          <div className={styles.textContainer}>
            <span
              className={styles.category}
              style={{ backgroundColor: `${post.data.categoryColor}` }}
            >
              {post.data.categoryName}
            </span>
            <h3 className={styles.postTitle}>{post.data.title}</h3>
            <div className={styles.detail}>
              <span className={styles.username}>Author Name - </span>
              <span className={styles.date}>
                {formatDate(post.data.date || null)}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MenuPosts;
