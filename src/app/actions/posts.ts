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
} from "firebase/firestore/lite";
import { db, storage } from "../firebase/config";
import { ref, deleteObject } from "firebase/storage";
import { BlogPost, BlogPostWithId } from "../types";
import { revalidatePath } from "next/cache";
import { getCategoryNameAndColor } from "../firebase/queries/sectionQueries";
import { checkQuantityOfPicks } from "./myPicks";

interface SuccessResponse {
  error: false;
  message: string;
  id: string;
  slug: string;
  draft: string;
}

interface ErrorResponse {
  error: true;
  message: string;
}

type CreateBlogPostResponse = SuccessResponse | ErrorResponse;

export async function createBlogPost(
  post: BlogPost
): Promise<CreateBlogPostResponse> {
  const { myPick, category, featured, slug, draft } = post;
  //create variable so can pass back id to frontend success return

  const postWithDate = { ...post, date: new Date(), editedAt: new Date() };
  let newId;

  try {
    //get categoryName first so it can be attached to the post
    const response = await getCategoryNameAndColor(category);

    //add the post to the db. if draft is false, add it to posts coll. if true, add it to drafts coll
    const newPost = !draft
      ? await addDoc(collection(db, "posts"), {
          ...postWithDate,
          categoryName: response?.name,
          categoryColor: response?.color,
        })
      : await addDoc(collection(db, "drafts"), {
          ...postWithDate,
          categoryName: response?.name,
          categoryColor: response?.color,
        });

    //if new post is successful, get id variable,
    if (newPost.id) {
      newId = newPost.id;

      // add it to the appropriate category. if it's a draft, save it under drafts. published, save it under posts
      const categoryDocRef = doc(db, "categories", category);
      const categoryDocSnapshot = await getDoc(categoryDocRef);
      let updatedCategoryData;
      if (categoryDocSnapshot.exists()) {
        draft
          ? (updatedCategoryData = {
              drafts: arrayUnion(newId),
            })
          : (updatedCategoryData = {
              posts: arrayUnion(newId),
            });

        await updateDoc(categoryDocRef, updatedCategoryData);
      } else {
        console.log("section does not exist");
      }

      //handle if featured is true - update featured collection
      if (featured && draft) {
        return { error: true, message: "draft can't be featured" };
      }

      if (featured) {
        const featuredRef = doc(db, "featured", "featuredPost");
        const featuredSnapshot = await getDoc(featuredRef);
        if (featuredSnapshot.exists()) {
          // remove any previously set post
          await updateDoc(featuredRef, {
            post: null,
          });
        }
        // set this new post as the featured one in the featured collection
        await updateDoc(featuredRef, {
          post: newId,
        });
      }

      //if mypick is true, add it to mypicks collection, but only if there are fewer than 5.
      if (myPick && draft) {
        return { error: true, message: "draft can't be a pick" };
      }

      if (myPick) {
        const myPicksRef = doc(db, "myPicks", "picks");
        const myPicksDocSnapshot = await getDoc(myPicksRef);
        if (myPicksDocSnapshot.exists()) {
          const currentPicks = myPicksDocSnapshot.data().posts || [];
          //check how many posts there are in the array. must be fewer than 5. if this fails, it returns an error.
          checkQuantityOfPicks(currentPicks, newId);

          const updatedPicks = {
            posts: arrayUnion(newId),
          };
          await updateDoc(myPicksRef, updatedPicks);
        } else {
          return { error: true, message: "too many picks" };
        }
      }
    }
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
      message: "Error adding post to database, try again later",
    };
  }
  //revalidate paths when you figure out rest of pages
  revalidatePath("/");
  return {
    error: false,
    message: "Successfully added post to database!",
    id: newId ? newId : "/",
    draft: draft ? "true" : "false",
    slug: slug,
  };
}

export async function editPost(
  postId: string,
  post: BlogPost,
  prevCollection: string
) {
  const {
    featured,
    additionalImages,
    category,
    categoryName,
    content,
    coverImage,
    draft,
    tags,
    title,
    views,
    slug,
    myPick,
  } = post;
  let postDate;
  let newCategoryName = "Other";
  let newCategoryColor = "#7A5DC7";
  const newCollection = draft ? "drafts" : "posts";
  let featuredStatus = draft? false : featured
  let myPickStatus = draft? false : myPick
  console.log("prevCollection", prevCollection, "newcollection", newCollection);

  console.log("draft inside", draft)
  try {
    //get previous collection
    const postRef = doc(db, prevCollection, postId);
    const postSnapshot = await getDoc(postRef);
    const prevPost = postSnapshot.data();

    if (prevPost) {
      //keep the date consistent
      const { date } = prevPost;
      postDate = date;

      //checks if draft state has changed, if it has, it deletes from the previous collection it was in
      if (prevCollection !== newCollection) {
        await deleteDoc(postRef);
      }

      // handle category change
      if (prevPost.category !== category || prevPost.draft != draft) {
        // get category document and snapshot of the current state
        const previousCategoryRef = doc(db, "categories", prevPost.category);
        const prevCategorySnapshot = await getDoc(previousCategoryRef);

        //if it's a post, remove from previous category
        //if it's a draft, remove it from it's previous category
        if (prevCategorySnapshot.exists()) {
          let removeCategoryData = prevPost.draft
            ? { drafts: arrayRemove(postId) }
            : { posts: arrayRemove(postId) };

          await updateDoc(previousCategoryRef, removeCategoryData);
        }
      }
    }
    //add postID to new category
    const newCategoryRef = doc(db, "categories", category);

    if (newCategoryRef) {
      let addCategoryData = draft
        ? { drafts: arrayUnion(postId) }
        : { posts: arrayUnion(postId) };

      await updateDoc(newCategoryRef, addCategoryData);
    }
    //get new categoryName
    if (category) {
      const response = await getCategoryNameAndColor(category);
      newCategoryName = response?.name;
      newCategoryColor = response?.color;
    }

    //check and update featured collection
    const featuredRef = doc(db, "featured", "featuredPost");
const featuredSnapshot = await getDoc(featuredRef);

if (featuredSnapshot.exists()) {
  const featuredData = featuredSnapshot.data();
  const prevFeaturedId = featuredData?.post || null;
  const prevFeaturedPostRef = prevFeaturedId ? doc(db, prevCollection, prevFeaturedId) : null;

  

  // where post is switched to a draft (it must be removed from featured)
  if (draft) {
    if (prevFeaturedId === postId) {
      console.log("remove post from featured because it's now a draft: ", postId);
      await updateDoc(featuredRef, { post: null });
    }
  } 
  //  where a post is switching from active to featured
  else if (featured) {
    if (postId !== prevFeaturedId) {
      console.log("new featured post:", postId);

      // remove previous featured post if it exists
      if (prevFeaturedId) {
        console.log("setting previous featured post to `featured: false`: ", prevFeaturedId);
        await updateDoc(prevFeaturedPostRef!, { featured: false });
      }

      // Set the new featured post
      await updateDoc(featuredRef, { post: postId });
    }
  }
  // where a post was previously featured but is no longer marked as featured
  else if (!featured && prevFeaturedId === postId) {
    console.log("removing previously featured post because it's no longer featured:", postId);
    await updateDoc(featuredRef, { post: null });
  }
} 
// the featured document doesn't exist, create it and feature the post if applicable
else {
  console.log("Featured post document does not exist. Creating...");
  if (featured) {
    console.log("Setting new featured post: ", postId);
    await setDoc(featuredRef, { post: postId });
  }
}
    //update my picks collection
    const myPicksRef = doc(db, "myPicks", "picks");
    const myPicksDocSnapshot = await getDoc(myPicksRef);

    if (myPicksDocSnapshot.exists()) {
      const currentPicks = myPicksDocSnapshot.data().posts || [];

      // if (myPick && prevPost?.myPick) {
      //   return;
      // }
      //if it's currently a draft, but it was previously myPick === true, remove it from the featured array db
      if (draft && prevPost?.myPick) {
        const updatedPicks = {
          posts: arrayRemove(postId),
        };
        await updateDoc(myPicksRef, updatedPicks);
      }
      //if the current post is not a draft, and it is now NOT a pick, but prev post was a pick
      if (!draft && !myPick && prevPost?.myPick) {
        //check how many posts there are in the array. must be fewer than 5. if this fails, it returns an error.

        const updatedPicks = {
          posts: arrayRemove(postId),
        };

        await updateDoc(myPicksRef, updatedPicks);
      }

      //finally, if it's NOT a draft and it's myPick
      if (!draft && myPick) {
        checkQuantityOfPicks(currentPicks, postId);
        const updatedPicks = {
          posts: arrayUnion(postId),
        };

        await updateDoc(myPicksRef, updatedPicks);
      } 
    }

    if (newCollection === prevCollection) {
      const updatePostRef = doc(db, prevCollection, postId);
      await updateDoc(updatePostRef, {
        featured: featuredStatus,
        myPick : myPickStatus,
        additionalImages,
        coverImage,
        content,
        category,
        categoryName: newCategoryName,
        categoryColor: newCategoryColor,
        date: postDate,
        editedAt: new Date(),
        draft,
        tags,
        title,
        views,
        slug,
      });
    }
    if (newCollection !== prevCollection) {
      const newPostRef = doc(db, newCollection, postId);
      await setDoc(newPostRef, {
        featured: featuredStatus,
        myPick: myPickStatus,
        additionalImages,
        coverImage,
        content,
        category,
        categoryName: newCategoryName,
        categoryColor: newCategoryColor,
        date: postDate,
        editedAt: new Date(),
        draft,
        tags,
        title,
        views,
        slug,
      });
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
      message: "Error editing post in database, try again later",
    };
  }
  //revalidate single path, main page, group page
  revalidatePath("/");
  return {
    error: false,
    slug: slug,
    draft: draft ? "true" : "false",
    message: "Successfully edited post to database!",
  };
}

export const deletePost = async (
  id: string,
  imagePath: string[],
  categoryId: string,
  post: BlogPost
) => {

  const {draft, featured, myPick} = post
  let draftStatus = draft === true ? "drafts" : "posts" 

  try {
    //delete from appropriate collection
    if(draftStatus === "posts") {
      
    await deleteDoc(doc(db, "posts", id));
    }

    if(draftStatus === "drafts") {
      await deleteDoc(doc(db, "drafts", id))
    }

    // delete images from Firebase Storage
    await Promise.all(
      imagePath.map(async (path) => {
        console.log(`image url = ${path}`);
        if (path) {
          // create a reference to the image in Firebase Storage
          const imageRef = ref(storage, path);
          console.log(`image ref is ${imageRef}`);
          // Delete the image from Firebase Storage
          deleteObject(imageRef).then(() => {
            console.log("deleted google storage photo");
          });
        }
      })
    );

        //delete product from appropriate document in categories collection
    //get the appropriate category document and a snapshot of the current state
    const categoriesDocRef = doc(db, "categories", categoryId);
    const categoriesDocSnapshot = await getDoc(categoriesDocRef);

    //remove from category collection. if draft === "posts", remove it from posts. otherwise remove it from "drafts"
    if (categoriesDocSnapshot.exists()) {
      let updatedSectionData
      if(draftStatus === "posts") {
         updatedSectionData = {
        posts: arrayRemove(id),
      };
      } else {
         updatedSectionData  = {
          drafts: arrayRemove(id)
         }
      }
     

      await updateDoc(categoriesDocRef, updatedSectionData);
    }


    //need to delete from myPicks and featured, if those things are true. errors if could delete from one, but not another, etc.
if(myPick) {
  const myPicksDocRef = doc(db, "myPicks", "picks");
  const myPicksDocSnapshot = await getDoc(myPicksDocRef);
  if(myPicksDocSnapshot.exists()) {
    let updatedPicks = {
      posts: arrayRemove(id)
    }

    await updateDoc(myPicksDocRef, updatedPicks);
  }
}

//remove from featured - maybe if there isn't any featured, i should get most recent post from db and add it?
if(featured) {
  const featuredRef = doc(db, "featured", "featuredPost");
  const featuredDocSnapshot = await getDoc(featuredRef);
  if(featuredDocSnapshot.exists()) {
    await updateDoc(featuredRef, {
      post: null, 
    });
  }
}


  } catch (error: any) {
    // figure out fb specific errors
    if (error.code === "permission-denied") {
      return {
        error: true,
        message: "Permission denied. Please try again later.",
      };
    }
    return {
      error: true,
      message: "Error deleting product from database, try again later",
    };
  }
  //revalidate paths that show products
  // revalidatePath("/admin");
  // revalidatePath("/admin/listings");
  // revalidatePath("/shop/products");
  return {
    error: false,
    message: "Successfully deleted product from database",
  };
};

export async function addCount(postId: string) {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      views: increment(1),
    });
  } catch (error) {
    return {
      error: true,
      message: "Error adding to views, try again later",
    };
  }

  //revalidate single path, main page, group page
  revalidatePath("/");
  return {
    error: false,
    message: "Successfully edited post to database!",
  };
}
