import Featured from "@/components/featured/Featured";
import styles from "./homepage.module.css";
import CategoryList from "@/components/categoryList/CategoryList";
import CardList from "@/components/cardList/CardList";
import Menu from "@/components/menu/Menu";
import { BlogPostWithId } from "./types";
import { CategoryWithId } from "./types";
import { getCategories } from "./firebase/queries/sectionQueries";
import { getActiveBlogPosts, getPopularPosts } from "./firebase/queries/blogPostQueries";
import { getPicks } from "./firebase/queries/picksQueries";
import getFeatured from "./firebase/queries/featuredQueries";
import { M_PLUS_1 } from "next/font/google";

type HomeProps = {
  searchParams: {page: string}

}
export default async function Home({searchParams} : HomeProps) {
  let featured: BlogPostWithId | null = null;
  let featuredError: string | null = null;
  let blogPosts: any = null;
  let blogPostsError: any = null;
  let totalPages: any;
  let totalPosts: any;
  let myPicks: BlogPostWithId[] | null = null;
  let myPicksError: string | null = null;
  let popularPosts: BlogPostWithId[] | null = null;
  let popularPostsError: string | null = null;
  let categoriesError: string | null = null;
  let categories: CategoryWithId[] | null = null;

  const currentPage = parseInt(searchParams.page) || 1
  const limitCount = 1

  //get blogPosts - needs page number and limit
  const fetchedPosts = await getActiveBlogPosts(currentPage, limitCount)


  if(fetchedPosts.error) {
    console.log(fetchedPosts.error)
    blogPostsError = fetchedPosts.error
  } else {
    blogPosts = fetchedPosts.data
    totalPages = fetchedPosts.totalPages
    totalPosts = fetchedPosts.totalPosts
  }

  //get featured post
  const featuredResult = await getFeatured();
  if (featuredResult.error) {
    featuredError = featuredResult.error;
  } else {
    featured = featuredResult.data;
  }

  //get categories for menu
  const categoryResult = await getCategories();
  if (categoryResult.error) {
    categoriesError = categoryResult.error;
  } else {
    categories = categoryResult.categories;
  }

  //get popular posts for menu
  const getPosts = await getPopularPosts();
  if (getPosts.error) {
    popularPostsError = getPosts.error;
  } else {
    popularPosts = getPosts.data;
  }

  //get editor picks for menu
  const getMyPicks = await getPicks();
  if (getMyPicks.error) {
    myPicksError = getMyPicks.error;
  } else {
    myPicks = getMyPicks.data;
  }
  return (
    <div className={styles.container}>
      <Featured featured={featured} featuredError={featuredError} />
      <CategoryList
        withImage={true}
        categories={categories}
        categoriesError={categoriesError}
      />
      <div className={styles.content}>
        <CardList blogPosts={blogPosts} blogPostsError={blogPostsError} totalPages={totalPages} currentPage={currentPage}/>
        <Menu
          categories={categories}
          categoriesError={categoriesError}
          myPicks={myPicks}
          myPicksError={myPicksError}
          popularPosts={popularPosts}
          popularPostsError={popularPostsError}
        />
      </div>
    </div>
  );
}
