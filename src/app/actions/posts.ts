"use server";

import {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  doc,
  deleteDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore/lite";
import { db, storage } from "../firebase/config";
import { ref, deleteObject } from "firebase/storage";
import { BlogPost } from "../types";
import { revalidatePath } from "next/cache";

interface SuccessResponse {
  error: false;
  message: string;
  id: string;
}

interface ErrorResponse {
  error: true;
  message: string;
}

type CreateBlogPostResponse = SuccessResponse | ErrorResponse;

export async function createBlogPost(
  post: BlogPost
): Promise<CreateBlogPostResponse> {
  const {
    title,
    additionalImages,
    coverImage,
    content,
    date,
    draft,
    slug,
    views,
    tags,
    category,
  } = post;
  //create variable so can pass back id to frontend success return
  let newId;
  try {
    //add the post to the db
    const newPost = await addDoc(collection(db, "posts"), post);
    //if it exists, update the id variable, then add it to the appropriate category
    if (newPost.id) {
      newId = newPost.id;
      const categoryDocRef = doc(db, "categories", category);
      const categoryDocSnapshot = await getDoc(categoryDocRef);

      if (categoryDocSnapshot.exists()) {
        const updatedCategoryData = {
          posts: arrayUnion(newPost.id),
        };
        await updateDoc(categoryDocRef, updatedCategoryData);
      } else {
        console.log("section does not exist");
      }
    }
  } catch (error: any) {
    //return errors, then successes
    if (error.code === "permission-denied") {
      return {
        error: true,
        message: "Permission denied. Please try again later.",
      };
    }
    return {
      error: true,
      message: "Error adding post to database, try again later",
    };
  }
  //revalidate paths when you figure out rest of pages
  revalidatePath("/");
  return {
    error: false,
    message: "Successfully added post to database!",
    id: newId ? newId : "/",
  };
}


export async function editPost(postId: string, post:BlogPost) {
  const {additionalImages, category, categoryName, content, coverImage, draft, tags, title, views, slug} = post
  let postDate
  try {
    const postRef = doc(db, "posts", postId)
    const postSnapshot = await getDoc(postRef)
    const prevPost = postSnapshot.data()
    if (prevPost) {
      const {date} = prevPost
      postDate = date

            // handle category change
            if (prevPost.category !== category) {
              // get category document and snapshot of the current state
              const prevPostDocRef = doc(db, "categories", prevPost.category);
              const prevPostDocSnapshot = await getDoc(prevPostDocRef);
      
              if (prevPostDocSnapshot.exists()) {
                const updatedCategoryData = {
                  posts: arrayRemove(postId),
                };
                await updateDoc(prevPostDocRef, updatedCategoryData);
              }
            }
          }

    if (postRef) {
      await updateDoc(postRef, {
        additionalImages,
        coverImage,
        content,
        category,
        categoryName,
        date: postDate,
        editedAt: new Date(),
        draft, 
        tags,
        title,
        views,
        slug
      }) 

      const newCategoryRef = doc(db, "categories", category)
      if(newCategoryRef) {
        const updateCategoryData = {
          posts: arrayUnion(category)
        }

        await updateDoc(newCategoryRef, updateCategoryData)
      }
    }

  } catch (error: any) {
    if (error.code === "permission-denied") {
      return {
        error: true,
        message: "Permission denied. Please try again later.",
      };
    }
    return {
      error: true,
      message: "Error editing post in database, try again later",
    };
  }
  //revalidate single path, main page, group page
  revalidatePath("/")
  return {
    error: false,
    message: "Successfully edited post to database!",

  };
}