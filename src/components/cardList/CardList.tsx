
import React from "react";
import styles from "./cardlist.module.css";
import Pagination from "../pagination/Pagination";
import Card from "../card/Card";
import { BlogPostWithId } from "@/app/types";

type CardListProps = {
  blogPosts: BlogPostWithId[] | null;
  blogPostsError: string | null;
  currentPage: number,
  totalPages: number,
}

const CardList = ({blogPosts, blogPostsError, currentPage, totalPages}: CardListProps) => {
  if(blogPostsError || !blogPosts) {
    return <div>{blogPostsError}</div>
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recent Posts</h1>
      <div className={styles.posts}>
        {blogPosts.map((post) => (
          <Card key={post.id} post = {post} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default CardList;
