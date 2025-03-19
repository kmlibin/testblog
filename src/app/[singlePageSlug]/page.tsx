import React from "react";
import { BlogPostWithId } from "../types";
import { getBlogPostById } from "../firebase/queries/blogPostQueries";
import SinglePost from "./SinglePost";
import styles from "./singlePage.module.css";
import { addCount } from "../actions/posts";

type Props = {
  searchParams: {
    id: string;
  };
  params: {
    singlePageSlug: string;
  };
};

async function page({ searchParams, params }: Props) {
  const postId = searchParams.id;
  let blogPost: BlogPostWithId | null = null;
  let blogPostError: string | null = null;


  try {
    //add to count
    await addCount(postId);
    const blogPostResult = await getBlogPostById(postId);
    if (blogPostResult.error) {
      blogPostError = blogPostResult.error;
    } else {
      blogPost = blogPostResult.data;
    }
  } catch (error) {
    blogPostError = "Error fetching post";
  }

  return (
    <div className={styles.container}>
      <SinglePost blogPost={blogPost} blogPostError={blogPostError} />
    </div>
  );
}

export default page;
