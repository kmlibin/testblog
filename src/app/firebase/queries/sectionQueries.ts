import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore/lite";
import { db, storage } from "../config";
import { ref, deleteObject } from "firebase/storage";
import { CategoryWithId } from "@/app/types";

export async function getCategories() {
  try {
    const collectionSnapshot = await getDocs(collection(db, "categories"));
    if (collectionSnapshot.empty) {
      return "Error Fetching Categories"
    }
    if (collectionSnapshot) {
      const categories: CategoryWithId[] = collectionSnapshot.docs.map(
        (doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            color: data.color,
            image: data.image,
            posts: data.posts,
          };
        }
      );

      return categories;
    }
  } catch (error: any) {
    return error.message;
  }
}
