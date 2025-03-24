"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";

import { BlogPostWithId, CategoryWithId } from "@/app/types";

import Edit from "./Edit";

type EditPageProps = {};

//switch to client side rendering. when i edit a post in the db and it switches between the posts/drafts collection
//it refetches, but of course it doesn' thave the correct params any longer (it fetches it's previous collection, not it's current).
//to avoid this i use useffect to control the rendering.
const page = (props: EditPageProps) => {
  const [blogPost, setBlogPost] = useState<BlogPostWithId | null>(null);
  const [blogPostError, setBlogPostError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryWithId[] | null>(null);
  const params = useParams<{ postId: string }>();
  const searchParams = useSearchParams();
  const draftStatus = searchParams.get("draft");
  const postId = params.postId;

  useEffect(() => {
    if (!postId || !draftStatus) return;
    const fetchBlogPost = async () => {
      try {
        const res = await fetch(
          `/api/getProductById?id=${postId}&draft=${draftStatus}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) {
          setBlogPostError(`Error: ${res.status}`);
        }

        const jsonResponse = await res.json();

        if (jsonResponse.status === 200 && jsonResponse.data) {
          setBlogPost(jsonResponse.data);
        } else {
          setBlogPostError(jsonResponse.error || "Unknown error occurred.");
        }
      } catch (error) {
        console.error("Error fetching post", error);
      }
    };
    fetchBlogPost();
  }, [postId, draftStatus]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/getCategories`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          setBlogPostError(`Error: ${res.status}`);
        }

        const jsonResponse = await res.json();
        if (jsonResponse.status === 200 && jsonResponse.categories) {
          setCategories(jsonResponse.categories);
        } else {
          setCategoriesError(jsonResponse.error || "Unknown error occurred.");
        }
      } catch (error) {
        console.error("Error fetching post", error);
      }
    };
    fetchCategories();
  }, []);

  // useEffect(() => {
  //   const categoryResult = getCategories();
  //   if (categoryResult?.error) {
  //     setCategoriesError(categoryResult?.error);
  //   } else {
  //     setCategories(categoryResult.categories);
  //   }

  //   const categoryResult = await getCategories();
  //   if (categoryResult.error) {
  //     categoriesError = categoryResult.error;
  //   } else {
  //     categories = categoryResult.categories;
  //   }

  //

  //   console.log(blogPostResult, categories)
  if (!blogPost && !blogPostError) return <p>Loading post...</p>;
  console.log("Rendering Edit with blogPost:", blogPost);
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
