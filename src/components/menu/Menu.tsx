import React from "react";
import styles from "./menu.module.css";
import Link from "next/link";
import Image from "next/image";
import MenuPosts from "../menuPosts/MenuPosts";
import { getPicks } from "@/app/firebase/queries/picksQueries";
import { getPopularPosts } from "@/app/firebase/queries/blogPostQueries";
import { BlogPostWithId } from "@/app/types";
import { CategoryWithId } from "@/app/types";
import paths from "@/paths";

type MenuProps = {
  myPicks: BlogPostWithId[] | null;
  myPicksError: string | null;
  popularPostsError: string | null;
  popularPosts: BlogPostWithId[] | null;
  categories: CategoryWithId[] | null;
  categoriesError: string | null;
};
export function Menu({
  myPicks,
  myPicksError,
  popularPosts,
  popularPostsError,
  categories,
  categoriesError,
}: MenuProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.subtitle}>{"What's Hot"}</h2>
      <h1 className={styles.title}>Most Popular</h1>
      <MenuPosts
        withImage={false}
        posts={popularPosts ? popularPosts : null}
        error={popularPostsError}
      />
      <h2 className={styles.subtitle}>Discover By Topic</h2>
      <h1 className={styles.title}>Categories</h1>
      <div className={styles.categoryList}>
        {categories?.map((cat) => (
            <Link
          href={paths.viewCategoryPage(cat.name, cat.id)}
          className={styles.categoryItem}
          style={{backgroundColor: cat.color}}
        >
          
          {cat.name}
        </Link>
        ))}
      

      </div>

      <h2 className={styles.subtitle}>Chosen by the editor</h2>
      <h1 className={styles.title}>Editor's Pick</h1>
      <MenuPosts posts={myPicks} error={myPicksError} withImage />
    </div>
  );
}

export default Menu;
