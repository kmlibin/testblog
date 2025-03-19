import { getDoc, updateDoc, doc, Timestamp } from "firebase/firestore/lite";
import { db } from "../config";
import { BlogPostWithId } from "@/app/types";

export async function getPicks() {
  const picksRef = doc(db, "myPicks", "picks");

  try {
    const picksSnapshot = await getDoc(picksRef);

    if (!picksSnapshot.exists()) {
      return { data: null, error: "No Picks to show!" };
    }

    const picksData = picksSnapshot.data();
    const postIds: string[] = picksData?.posts || [];

    if (postIds.length === 0) {
      return { data: null, error: "No Picks to show!" };
    }

    // get the posts from the "posts" collection using the IDs
    const postsPromises = postIds.map(async (id): Promise<BlogPostWithId | null> => {
      const postRef = doc(db, "posts", id);
      const postSnapshot = await getDoc(postRef);

      if (postSnapshot.exists()) {
        const postData = postSnapshot.data();

            // check if the draft is true, if so, skip this post
            if (postData.draft) {
              return null;
            }
            
        const formattedPost: BlogPostWithId = {
          id: postSnapshot.id,
          data: {
            ...postData,
            featured: postData.featured, 
            myPick: postData.myPick,      
            category: postData.category,    
            content: postData.content,       
            additionalImages: postData.additionalImages,
            categoryName: postData.categoryName,
            categoryColor: postData.categoryColor,
            coverImage: postData.coverImage,
            tags: postData.tags,
            views: postData.views,
            draft: postData.draft,
            slug: postData.slug,             
            title: postData.title,           
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

        return formattedPost;
      }

     
      // if post doesn't exist
      return null;
    });

    const posts = await Promise.all(postsPromises);

    // get rid of null results in case some posts don't exist
    const validPosts = posts.filter(
      (post): post is BlogPostWithId => post !== null
    );
    return {
      data: validPosts,
      error: null,
    };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}