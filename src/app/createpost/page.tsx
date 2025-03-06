import React from "react";
import CreatePost from "./CreatePost";
import { getCategories } from "../firebase/queries/sectionQueries";
import { CategoryWithId } from "../types";

async function page() {
  let categories: CategoryWithId[] | null = null;
  let error: string | null = null;

  try {
    categories = await getCategories();
    if (categories && typeof categories === "string") {
      error = categories;
      categories = null;
    }
    if (categories && categories.length < 1) {
      error = "An error occurred while fetching categories";
      categories = null;
    }
  } catch (err) {
    error = "an error has occurred fetching categories";
  }

  return <CreatePost categories={categories} error={error} />;
}

export default page;
