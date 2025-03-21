import React from "react";
import { getBlogPostById } from "@/app/firebase/queries/blogPostQueries";
import SinglePost from "./SinglePost";
import styles from "./singlePage.module.css";
import { addCount } from "@/app/actions/posts";
import { getPopularPosts } from "@/app/firebase/queries/blogPostQueries";
import { getPicks } from "@/app/firebase/queries/picksQueries";
import { getCategories } from "@/app/firebase/queries/sectionQueries";
import { CategoryWithId, BlogPostWithId } from "@/app/types";
type Props = {
  searchParams: {
    id: string;
    draft: string;
  };
  params: {
    singlePageSlug: string;
    pageId: string;
  };
};

async function page({ searchParams, params }: Props) {
  const postId = params.pageId;
  console.log(params)
  let blogPost: BlogPostWithId | null = null;
  let blogPostError: string | null = null;
  let myPicks: BlogPostWithId[] | null = null;
  let myPicksError: string | null = null;
  let popularPosts: BlogPostWithId[] | null = null;
  let popularPostsError: string | null = null;
  let categoriesError: string | null = null;
  let categories: CategoryWithId[] | null = null;

  console.log(searchParams);
  //get categories for menu
  const categoryResult = await getCategories();
  if (categoryResult.error) {
    categoriesError = categoryResult.error;
  } else {
    categories = categoryResult.categories;
  }

  //get popular posts for menu
  const getPosts = await getPopularPosts();
  if (getPosts.error) {
    popularPostsError = getPosts.error;
  } else {
    popularPosts = getPosts.data;
  }

  //get editor picks for menu
  const getMyPicks = await getPicks();
  if (getMyPicks.error) {
    myPicksError = getMyPicks.error;
  } else {
    myPicks = getMyPicks.data;
  }

  //get blogpost
  const blogPostResult = await getBlogPostById(postId, searchParams.draft);
  if (blogPostResult.error) {
    blogPostError = blogPostResult.error;
  } else {
    blogPost = blogPostResult.data;
  }

  //add to count
  if (blogPost?.data?.draft === false) {
    await addCount(postId);
  }
console.log(blogPost)
  return (


    <div className={styles.container}>
      <SinglePost
        blogPost={blogPost}
        blogPostError={blogPostError}
        myPicks={myPicks}
        popularPosts={popularPosts}
        popularPostsError={popularPostsError}
        myPicksError={myPicksError}
        categories={categories}
        categoriesError={categoriesError}
      />
    </div>
  );
}

export default page;
