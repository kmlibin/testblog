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

type CategoryResult = { categories: CategoryWithId[] | null; error: string | null };

export async function getCategories(): Promise<CategoryResult> {
  try {
    const collectionSnapshot = await getDocs(collection(db, "categories"));
    if (collectionSnapshot.empty) {
      return { error: "error fetching categories", categories: null };
    }
    if (collectionSnapshot) {
      const categories: CategoryWithId[] = collectionSnapshot.docs.map(
        (doc) => {
          const data = doc.data();
          return { id: doc.id, name: data.name, color: data.color, image: data.image, posts: data.posts };
        }
      );

      return { error: null, categories };
    }
    return {error: "Error fetching categories", categories: null}
  } catch (error: any) {
    return { error: error.message, categories: null };
  }
}

export async function getCategoryName(category: string) {
      //get categoryName from doc id (category is passed as the id, not the name)
      const categoryDocRef = doc(db, "categories", category);
      const categoryDocSnapshot = await getDoc(categoryDocRef);
      if (categoryDocSnapshot.exists()) {
        const categoryData = categoryDocSnapshot.data();
        return categoryData.name;
  
      }
}