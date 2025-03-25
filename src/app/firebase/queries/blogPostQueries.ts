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
import { BlogPost } from "@/app/types";
import { BlogPostWithId } from "@/app/types";

type SingleBlogPostResult = {
  data: BlogPostWithId | null;
  error: string | null;
};
type MultipleBlogPostResult = {
  data: BlogPostWithId[] | null;
  error: string | null;
};

// gets prev document for pagination
async function getLastDocument(page: number, pageLimit: number) {
  // fetch documents when page > 1 (because we need a last document to continue the query)
  // console.log("page", page, "pageLimit", pageLimit, "limitBy", pageLimit * (page - 1))
  if (page > 1) {
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("date", "desc"),
      limit(pageLimit * (page - 1))
    );
    const postsSnapshot = await getDocs(postsQuery);

    // last document on the current page
    const lastDocument = postsSnapshot.docs[postsSnapshot.docs.length - 1];
    // console.log("last document:", lastDocument ? lastDocument.data() : "No last document found");

    return lastDocument || null;
  }

  // if it's the first page, no last document is needed - return null
  return null;
}

//limit how many to show per page, start after doc is the doc you want it to start after, last visible stores last doc of current page
export async function getActiveBlogPosts(
  page: number,
  limitCount: number,
  searchStatus: string,
  searchOrder: string,
  searchCategory: string | null
): Promise<{
  error: string | null;
  data: BlogPostWithId[] | null;
  totalPages: number | null;
  totalPosts: number | null;
}> {
  // console.log("hits", page, limitCount, "searchStatus", searchStatus, "searchOrder", searchOrder, "searchCategory", searchCategory)

  try {
    //start document for pagination
    let postsQuery = query(
      collection(db, searchStatus === "posts" ? "posts" : "drafts"),
      orderBy("date", searchOrder === "asc" ? "asc" : "desc"),
      limit(limitCount)
    );

    if (searchCategory) {
      postsQuery = query(
        collection(db, searchStatus === "posts" ? "posts" : "drafts"),
        where("categoryName", "==", searchCategory),
        orderBy("date", searchOrder === "asc" ? "asc" : "desc"),
        limit(limitCount)
      );
    }

    // get the last document from the previous page
    if (page > 1) {
      const lastDocument = await getLastDocument(page, limitCount);

      if (!lastDocument) {
        console.log("Error: No valid last document found");
        return {
          error: "Error fetching posts",
          data: null,
          totalPages: null,
          totalPosts: null,
        };
      }
      if (searchCategory) {
        postsQuery = query(
          collection(db, searchStatus === "posts" ? "posts" : "drafts"),
          where("categoryName", "==", searchCategory),
          orderBy("date", searchOrder === "asc" ? "asc" : "desc"),
          startAfter(lastDocument),
          limit(limitCount)
        );
      }
      postsQuery = query(
        collection(db, searchStatus),
        orderBy("date", searchOrder === "asc" ? "asc" : "desc"),
        startAfter(lastDocument),
        limit(limitCount)
      );
    }

    //access the documents in the db database
    const postsSnapshot = await getDocs(postsQuery);
    //get count from database
    const totalPostsSnapshot = await getCount(collection(db, searchStatus));
    const totalPosts = totalPostsSnapshot.data().count;
    //calculate total pages
    const totalPages = Math.ceil(totalPosts / limitCount);
    if (postsSnapshot.empty) {
      return {
        error: searchCategory
          ? `No posts found under the category "${searchCategory}".`
          : "Error fetching posts",
        data: null,
        totalPages: 0,
        totalPosts: 0,
      };
    }

    if (postsSnapshot) {
      const posts: any = postsSnapshot.docs.map((doc) => {
        const postData = doc.data() as BlogPost;
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
        return { id: doc.id, data: formattedPostData };
      });

      return { error: null, data: posts, totalPages, totalPosts };
    }
    return {
      error: "Error fetching posts",
      data: null,
      totalPages: null,
      totalPosts: null,
    };
  } catch (error: any) {
    return {
      error: error.message,
      data: null,
      totalPages: null,
      totalPosts: null,
    };
  }
}

export async function getBlogPostById(
  id: string,
  draft: string
): Promise<SingleBlogPostResult> {
  console.log("draft", draft, "id", id);
  const collection = draft === "true" ? "drafts" : "posts";
  const postRef = doc(db, collection, id);

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

    const popularPosts: BlogPostWithId[] | null = postsSnapshot.docs
      .map((doc) => {
        const postData = doc.data() as BlogPost;
        //don't return it if it's a draft
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
      })
      .filter((post): post is BlogPostWithId => post !== null);

    return { data: popularPosts, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
