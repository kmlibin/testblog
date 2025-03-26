import React from "react";
import AdminDashboard from "./AdminDashboard";
import { BlogPostWithId, CategoryWithId } from "@/app/types";
import { getCategories } from "@/app/firebase/queries/sectionQueries";
import { getPicks } from "@/app/firebase/queries/picksQueries";
import getFeatured from "@/app/firebase/queries/featuredQueries";

type Props = {
  searchParams: {
    date: string;
    draft: string;
    category: string;
  };
};

//this page should be shown only to admin, needs an auth check
// default loads active posts, but tabs at top show "drafts" or "active posts"
//should be able to sort by date, category.

async function page({ searchParams }: Props) {
  // console.log(searchParams);
  let blogPost: BlogPostWithId | null = null;
  let blogPostError: string | null = null;
  let myPicks: BlogPostWithId[] | null = null;
  let myPicksError: string | null = null;
  let featuredPost: BlogPostWithId | null = null;
  let featuredPostError: string | null = null;
  let categoriesError: string | null = null;
  let categories: CategoryWithId[] | null = null;

  //get categories for menu
  const categoryResult = await getCategories();
  if (categoryResult.error) {
    categoriesError = categoryResult.error;
  } else {
    categories = categoryResult.categories;
  }

  //get editor picks 
  const getMyPicks = await getPicks();
  if (getMyPicks.error) {
    myPicksError = getMyPicks.error;
  } else {
    myPicks = getMyPicks.data;
  }
//get featured post
  const featured = await getFeatured();
  // console.log(featured);
  if (featured.error) {
    featuredPostError = featured.error;
  } else {
    featuredPost = featured.data;
  }


  return (
    <div>
      <AdminDashboard
        myPicks={myPicks}
        myPicksError={myPicksError}
        featuredPost={featuredPost}
        featuredPostError={featuredPostError}
        categories={categories}
        categoriesError={categoriesError}
      />
    </div>
  );
}

export default page;
