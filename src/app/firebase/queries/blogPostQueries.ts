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
  Timestamp
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

        // convert Firestore timestamps to plain JavaScript Date or string
        const formattedPostData = {
          ...postData,
          date:
            postData.date instanceof Timestamp
              ? postData.date.toDate().toISOString()
              : null,
          editedAt:
            postData.editedAt instanceof Timestamp
              ? postData.editedAt.toDate().toISOString()
              : null,
        };

      return {
        data: {
          id: postSnapshot.id,
          data: formattedPostData ,
        },
        error: null,
      };
    }
    return { data: null, error: "Error fetching post" };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
