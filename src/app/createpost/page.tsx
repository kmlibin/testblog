import React from "react";
import CreatePost from "./CreatePost";
import { getCategories } from "../firebase/queries/sectionQueries";
import { CategoryWithId } from "../types";

async function page() {
  let categories: CategoryWithId[] | null = null;
  let categoriesError: string | null = null;

   const categoryResult = await getCategories();
   if (categoryResult.error) {
     categoriesError = categoryResult.error;
   } else {
     categories = categoryResult.categories;
   }


  return <CreatePost categories={categories} error={categoriesError} />;
}

export default page;
