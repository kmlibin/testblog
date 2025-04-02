"use server";

import {
  collection,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  doc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore/lite";
import { db } from "../firebase/config";

import { revalidatePath } from "next/cache";

export async function editCategory( newCat: any) {
  const { color, name, image, id } = newCat;
  let newImage
  if (image === null) {
    newImage = {path: "", url: ""}
  } else {
    newImage = {url: image.url, path: image.path}
  }
  try {
    //get previous collection
    const catRef = doc(db, "categories", id);
    const catSnapshot = await getDoc(catRef);
    const categoryToEdit = catSnapshot.data();

    if (catSnapshot.exists()) {
      await updateDoc(catRef, {
        ...categoryToEdit,
        color,
        name,
        image : newImage,
      });
      console.log("success")
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
      message: "Error editing category in database, try again later",
    };
  }
  //revalidate single path, main page, group page
  revalidatePath("/");
  return {
    error: false,
    message: "Successfully edited category in database!",
  };
}
