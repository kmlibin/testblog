import React from "react";
import { BlogPostWithId, CategoryWithId } from "@/app/types";
import { getBlogPostById } from "@/app/firebase/queries/blogPostQueries";
import { getCategories } from "@/app/firebase/queries/sectionQueries";
import Edit from "./Edit";

type EditPageProps = {
  params: {
    postId: string;
  };
};

const page = async (props: EditPageProps) => {
  const { params } = props;
  const postId = params.postId;
  let blogPost: BlogPostWithId | null = null;
  let blogPostError: string | null = null;
  let categoriesError: string | null = null;
  let categories: CategoryWithId[] | null = null;

  const categoryResult = await getCategories();
  if (categoryResult.error) {
    categoriesError = categoryResult.error;
  } else {
    categories = categoryResult.categories;
  }

  const blogPostResult = await getBlogPostById(postId);
  if (blogPostResult.error) {
    blogPostError = blogPostResult.error;
  } else {
    blogPost = blogPostResult.data;
  }

  //   console.log(blogPostResult, categories)
    console.log(blogPostError, categoriesError)
  return (
    <Edit
      categoriesError={categoriesError}
      blogPostError={blogPostError}
      blogPost={blogPost}
      categories={categories}
    />
  );
};

export default page;
