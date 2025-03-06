import React from "react";
import CreatePost from "./CreatePost";
import { getCategories } from "../firebase/queries/sectionQueries";
import { CategoryWithId } from "../types";

async function page() {
  let categories: CategoryWithId[] | null = null;
  let error: string | null = null;

  try {
    const categoriesInDB = await getCategories();
    if (Array.isArray(categoriesInDB) && categoriesInDB.length > 1) {
      categories = categoriesInDB;
    }
  } catch (err) {
    error = "an error has occurred fetching categories";
  }

  return <CreatePost categories={categories} error={error} />;
}

export default page;
