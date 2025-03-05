import React from "react";
import CreatePost from "./CreatePost";
import { getCategories } from "../firebase/queries/sectionQueries";

async function page() {
  let categories = null;
  let error = null;

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
