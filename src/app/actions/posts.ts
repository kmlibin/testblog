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
import { getCategoryNameAndColor } from "../firebase/queries/sectionQueries";
import { checkQuantityOfPicks } from "./myPicks";

interface SuccessResponse {
  error: false;
  message: string;
  id: string;
  slug: string;
}

interface ErrorResponse {
  error: true;
  message: string;
}

type CreateBlogPostResponse = SuccessResponse | ErrorResponse;

export async function createBlogPost(
  post: BlogPost
): Promise<CreateBlogPostResponse> {
  const { myPick, category, featured, slug } = post;
  //create variable so can pass back id to frontend success return

  const postWithDate = { ...post, date: new Date(), editedAt: new Date() };
  let newId;


  try {
    //get categoryName first so it can be attached to the post
    const response = await getCategoryNameAndColor(category);
    //add the post to the db
    const newPost = await addDoc(collection(db, "posts"), {
      ...postWithDate,
      categoryName : response?.name,
      categoryColor: response?.color,
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

      //handle if featured is true - update featured collection
      if (featured) {
        const featuredRef = doc(db, "featured", "featuredPost");
        const featuredSnapshot = await getDoc(featuredRef);
        if (featuredSnapshot.exists()) {
          // remove any previously set post
          await updateDoc(featuredRef, {
            post: null,
          });
        }
        // set this new post as the featured one in the featured collection
        await updateDoc(featuredRef, {
          post: newId,
        });
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
    slug: slug,

  };
}

export async function editPost(postId: string, post: BlogPost) {
  const {
    featured,
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
  let newCategoryColor = "#7A5DC7"


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
       const response = await getCategoryNameAndColor(category);
       newCategoryName = response?.name
       newCategoryColor = response?.color
    }

    //check and update featured collection
    if (prevPost?.featured !== featured) {
      const featuredRef = doc(db, "featured", "featuredPost");
      const featuredSnapshot = await getDoc(featuredRef);

      if (featuredSnapshot.exists()) {
        const prevFeaturedId = featuredSnapshot.data().post || "";
        //if post id doesn't match previous post id, remove it.
        if (featured && postId !== prevFeaturedId) {
          await updateDoc(featuredRef, {
            post: prevFeaturedId ? arrayRemove(prevFeaturedId) : null,
          });
          //add new id
          await updateDoc(featuredRef, {
            post: postId,
          });
        }
      }
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
            posts: arrayRemove(postId),
          };
          await updateDoc(myPicksRef, updatedPicks);
        }
      } else {
        return { error: true, message: "Error updating picks collection" };
      }
    }

    if (postRef) {
      await updateDoc(postRef, {
        featured,
        myPick,
        additionalImages,
        coverImage,
        content,
        category,
        categoryName: newCategoryName,
        categoryColor: newCategoryColor,
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
