import {
  collection,
  getDocs,
  doc,
  getDoc,
  where,
  query,
  limit,
  orderBy,
  startAfter,
  count,
  getCount,
  startAt,
} from "firebase/firestore/lite";

import { db } from "@/app/firebase/config";
import { BlogPost, Category } from "@/app/types";
import { BlogPostWithId } from "@/app/types";

type BlogPostResult = { data: BlogPostWithId | null; error: string | null };

export async function getBlogPostById(id: string): Promise<BlogPostResult> {
  const postRef = doc(db, "posts", id);
  try {
    const postSnapshot = await getDoc(postRef);

    if (!postSnapshot.exists()) {
      return { data: null, error: "Post with that ID does not exist" };
    }
    if (postSnapshot) {
      const postData = postSnapshot.data() as BlogPost;

      //fetch category name, since category is saved as an id in the blogpost
      let categoryName = "Other";
      if (postData.category) {
        const categoryRef = doc(db, "categories", postData.category);
        const categorySnapshot = await getDoc(categoryRef);
        if (categorySnapshot.exists()) {
          const categoryData = categorySnapshot.data() as Category;
          categoryName = categoryData.name;
        }
      }

      return {
        data: {
          id: postSnapshot.id,
          data: { ...postData, category: categoryName },
        },
        error: null,
      };
    }
    return { data: null, error: "Error fetching post" };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
