import React from "react";
import styles from "./singlePage.module.css";
import Menu from "@/components/menu/Menu";
import Image from "next/image";
import { BlogPostWithId } from "../types";
import { getBlogPostById } from "../firebase/queries/blogPostQueries";
import { addCount } from "../actions/posts";
import SinglePost from "./SinglePost";

type Props = {
  searchParams: {
    id: string;
  };
  params: {
    singlePageSlug: string;
  };
};

const page = async ({ searchParams, params }: Props) => {
  //get id from search params, use that to search for the post. return post.
  const postId = searchParams.id;
  let blogPost: BlogPostWithId | null = null;
  let blogPostError: string | null = null;
  //add to count
  await addCount(searchParams.id);

  //fetch blogs
  const blogPostResult = await getBlogPostById(postId);

  if (blogPostResult.error) {
    blogPostError = blogPostResult.error;
  } else {
    blogPost = blogPostResult.data;
  }

  return <SinglePost blogPost={blogPost} blogPostError={blogPostError} />;
};

export default page;
