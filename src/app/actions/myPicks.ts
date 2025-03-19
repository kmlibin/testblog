"use server";
import { getDoc, updateDoc, doc } from "firebase/firestore/lite";
import { db } from "../firebase/config";
import { BlogPostWithId } from "../types";


export async function checkQuantityOfPicks(currentPicks: BlogPostWithId[], newId: string) {
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

