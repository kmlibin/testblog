"use server";
import { getDoc, updateDoc, doc } from "firebase/firestore/lite";
import { db } from "../firebase/config";
import { BlogPostWithId } from "../types";

export async function checkQuantityOfPicks(currentPicks: any, newId: string) {
  if (currentPicks.length >= 5) {
    const postRef = doc(db, "posts", newId);
    const postSnapshot = await getDoc(postRef);

    if (postSnapshot.exists()) {
      const postData = postSnapshot.data();
      await updateDoc(postRef, {
        ...postData,
        myPick: false,
      });
    }
    return {
      error: true,
      message: "Post removed from picks because the limit of 5 was reached.",
    };
  }
}

export async function getPicks() {
  const picksRef = doc(db, "myPicks", "picks");

  try {
    const picksSnapshot = await getDoc(picksRef);

    if (!picksSnapshot.exists()) {
      return { data: null, error: "No Picks to show!" };
    }

    const picksData = picksSnapshot.data();
    const postIds: string[] = picksData?.posts || [];

    if (postIds.length === 0) {
      return { data: null, error: "No Picks to show!" };
    }

    // get the posts from the "posts" collection using the IDs
    const postsPromises = postIds.map(async (id) => {
      const postRef = doc(db, "posts", id);
      const postSnapshot = await getDoc(postRef);

      if (postSnapshot.exists()) {
        return {
          id: postSnapshot.id,
          data: postSnapshot.data(),
        };
      }
      // if post doesn't exist
      return null;
    });

    const posts = await Promise.all(postsPromises);

    // get rid of null results in case some posts don't exist
    const validPosts = posts.filter(
      (post): post is BlogPostWithId => post !== null
    );
    return {
      data: validPosts,
      error: null,
    };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
