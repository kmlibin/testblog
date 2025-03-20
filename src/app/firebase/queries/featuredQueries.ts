import { getDoc, doc } from "firebase/firestore/lite";
import { db } from "../config";
import { getBlogPostById } from "./blogPostQueries";
import { BlogPostWithId } from "@/app/types";

type SingleReturnType = {data: BlogPostWithId | null, error: null | string}

export default async function getFeatured(): Promise<SingleReturnType> {
  const featuredRef = doc(db, "featured", "featuredPost");
  try {
    const featuredSnapshot = await getDoc(featuredRef);
    if (!featuredSnapshot.exists()) {
      return { data: null, error: "no featured post" };
    }
    const postId = featuredSnapshot.data();
    if (postId) {
      const blogPost = await getBlogPostById(postId.post, "false");
      return { data: blogPost.data, error: null };
    } else {
      return { data: null, error: "no featured post" };
    }
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
