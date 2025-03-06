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
      throw new Error("Categories collection is empty");
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
  } catch (error) {
    throw new Error("error fetching categories");
  }
}
