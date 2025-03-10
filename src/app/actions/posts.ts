"use server";

import {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  doc,
  deleteDoc,
  arrayUnion,
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
