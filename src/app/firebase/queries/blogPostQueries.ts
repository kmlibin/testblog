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
  Timestamp,
} from "firebase/firestore/lite";

import { db } from "@/app/firebase/config";
import { BlogPost, Category } from "@/app/types";
import { BlogPostWithId } from "@/app/types";

type SingleBlogPostResult = { data: BlogPostWithId | null; error: string | null };
type MultipleBlogPostResult = { data: BlogPostWithId[] | null; error: string | null };

export async function getBlogPostById(id: string): Promise<SingleBlogPostResult> {
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
          data: formattedPostData,
        },
        error: null,
      };
    }
    return { data: null, error: "Error fetching post" };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function getPopularPosts(): Promise<MultipleBlogPostResult> {
  try {
    // query the posts collection, ordering by views in descending order and limiting to 5
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("views", "desc"),
      limit(5)
    );
    const postsSnapshot = await getDocs(postsQuery);

    if (postsSnapshot.empty) {
      return { data: null, error: "No popular posts found." };
    }

    // format each post
    const popularPosts: BlogPostWithId[] = postsSnapshot.docs.map((doc) => {
      const postData = doc.data() as BlogPost;

      return {
        id: doc.id,
        data: {
          ...postData,
          date:
            postData.date instanceof Timestamp
              ? postData.date.toDate().toISOString()
              : null,
          editedAt:
            postData.editedAt instanceof Timestamp
              ? postData.editedAt.toDate().toISOString()
              : null,
        },
      };
    });

    return { data: popularPosts, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
