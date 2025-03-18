"use server";

import {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  doc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore/lite";
import { db, storage } from "../firebase/config";
import { ref, deleteObject } from "firebase/storage";
import { BlogPost } from "../types";
import { revalidatePath } from "next/cache";
import { getCategoryName } from "../firebase/queries/sectionQueries";
import { checkQuantityOfPicks } from "./myPicks";

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
  const { myPick, category } = post;
  //create variable so can pass back id to frontend success return

  const postWithDate = { ...post, date: new Date(), editedAt: new Date() };
  let newId;
  let categoryName = "Other";

  try {
    //get categoryName first so it can be attached to the post
    categoryName = await getCategoryName(category);
    //add the post to the db
    const newPost = await addDoc(collection(db, "posts"), {
      ...postWithDate,
      categoryName,
    });

    //if new post is successful, get id variable,
    if (newPost.id) {
      newId = newPost.id;

      // add it to the appropriate category
      const categoryDocRef = doc(db, "categories", category);
      const categoryDocSnapshot = await getDoc(categoryDocRef);
      if (categoryDocSnapshot.exists()) {
        const updatedCategoryData = {
          posts: arrayUnion(newId),
        };
        await updateDoc(categoryDocRef, updatedCategoryData);
      } else {
        console.log("section does not exist");
      }

      //if mypick is true, add it to mypicks collection, but only if there are fewer than 5.
      if (myPick) {
        const myPicksRef = doc(db, "myPicks", "picks");
        const myPicksDocSnapshot = await getDoc(myPicksRef);
        if (myPicksDocSnapshot.exists()) {
          const currentPicks = myPicksDocSnapshot.data().posts || [];
          //check how many posts there are in the array. must be fewer than 5. if this fails, it returns an error.
          checkQuantityOfPicks(currentPicks, newId);

          const updatedPicks = {
            posts: arrayUnion(newId),
          };
          await updateDoc(myPicksRef, updatedPicks);
        } else {
          return { error: true, message: "too many picks" };
        }
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

export async function editPost(postId: string, post: BlogPost) {
  const {
    additionalImages,
    category,
    categoryName,
    content,
    coverImage,
    draft,
    tags,
    title,
    views,
    slug,
    myPick,
  } = post;
  let postDate;
  let newCategoryName = "Other";

  try {
    const postRef = doc(db, "posts", postId);
    const postSnapshot = await getDoc(postRef);
    const prevPost = postSnapshot.data();
    
    if (prevPost) {
      //keep the date consistent
      const { date } = prevPost;
      postDate = date;
      // handle category change
      if (prevPost.category !== category) {
        // get category document and snapshot of the current state
        const prevPostDocRef = doc(db, "categories", prevPost.category);
        const prevPostDocSnapshot = await getDoc(prevPostDocRef);
        //remove from previous category
        if (prevPostDocSnapshot.exists()) {
          const updatedCategoryData = {
            posts: arrayRemove(postId),
          };
          await updateDoc(prevPostDocRef, updatedCategoryData);
        }
      }
    }
    //add postID to new category
    const newCategoryRef = doc(db, "categories", category);

    if (newCategoryRef) {
      const updateCategoryData = {
        posts: arrayUnion(postId),
      };

      await updateDoc(newCategoryRef, updateCategoryData);
    }
    //get new categoryName
    if (category) {
      newCategoryName = await getCategoryName(category);
    }

    //check and update myPick in the myPicks collection
    if (prevPost?.myPick !== myPick) {
      const myPicksRef = doc(db, "myPicks", "picks");
      const myPicksDocSnapshot = await getDoc(myPicksRef);
      if (myPicksDocSnapshot.exists()) {
        const currentPicks = myPicksDocSnapshot.data().posts || [];
        //check how many posts there are in the array. must be fewer than 5. if this fails, it returns an error.
        if (myPick) {
          checkQuantityOfPicks(currentPicks, postId);
          const updatedPicks = {
            posts: arrayUnion(postId),
          };

          await updateDoc(myPicksRef, updatedPicks);
        } else {
          //if my pick is false, remove from myPicks
          const updatedPicks = {
            posts: arrayRemove(postId)
          }
          await updateDoc(myPicksRef, updatedPicks);
        }
      } else {
        return { error: true, message: "Error updating picks collection" };
      }
    }

    if (postRef) {
      await updateDoc(postRef, {
        myPick,
        additionalImages,
        coverImage,
        content,
        category,
        categoryName: newCategoryName,
        date: postDate,
        editedAt: new Date(),
        draft,
        tags,
        title,
        views,
        slug,
      });
    }
  } catch (error: any) {
    console.log(error);
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
  revalidatePath("/");
  return {
    error: false,
    slug: slug,
    message: "Successfully edited post to database!",
  };
}

export async function addCount(postId: string) {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      views: increment(1),
    });
  } catch (error) {
    return {
      error: true,
      message: "Error adding to views, try again later",
    };
  }

  //revalidate single path, main page, group page
  revalidatePath("/");
  return {
    error: false,
    message: "Successfully edited post to database!",
  };
}
