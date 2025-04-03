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
  query,
  where,
  getDocs,
} from "firebase/firestore/lite";
import { db } from "../firebase/config";

import { revalidatePath } from "next/cache";

export async function createCategory(newCat: any) {
  const { color, name, image } = newCat;

  //doublecheck there are values. return if not.
  if (!name || !color || !image) {
    return {
      error: true,
      message: "Category name , color, and image are required.",
    };
  }

  //convert name to lower case, store it lower case, and then upper case it on frontend. makes it easier to check if there are duplicat names
  const normalizedName = name.trim().toLowerCase();
  try {
    // check if the category name already exists
    const categoryRef = collection(db, "categories");
    const queryResult = query(categoryRef, where("name", "==", normalizedName));
    const querySnapshot = await getDocs(queryResult);

    if (!querySnapshot.empty) {
      return {
        error: true,
        message: "A category with this name already exists.",
      };
    }
    //add to categories
    await addDoc(collection(db, "categories"), {
      color,
      image,
      name: normalizedName,
      post: [],
      drafts: [],
    });
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
      message: "Error adding category to database, try again later",
    };
  }
  //revalidate paths when you figure out rest of pages
  revalidatePath("/");
  return {
    error: false,
    message: "Successfully added new category!",
  };
}

export async function editCategory(newCat: any) {
  const { color, name, image, id } = newCat;
  let newImage;
  if (image === null) {
    newImage = { path: "", url: "" };
  } else {
    newImage = { url: image.url, path: image.path };
  }
  try {
    //get previous collection
    const catRef = doc(db, "categories", id);
    const catSnapshot = await getDoc(catRef);
    const categoryToEdit = catSnapshot.data();

    //TO DO: check if the url/path are different. if so, delete it from google storage

    if (catSnapshot.exists()) {
      await updateDoc(catRef, {
        ...categoryToEdit,
        color,
        name,
        image: newImage,
      });
      console.log("success");
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
