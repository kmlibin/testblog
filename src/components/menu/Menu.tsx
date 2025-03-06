import React from "react";
import styles from "./menu.module.css";
import Link from "next/link";
import Image from "next/image";
import MenuPosts from "../menuPosts/MenuPosts";
const Menu = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.subtitle}>{"What's Hot"}</h2>
      <h1 className={styles.title}>Most Popular</h1>
   <MenuPosts />
      <h2 className={styles.subtitle}>Discover By Topic</h2>
      <h1 className={styles.title}>Categories</h1>
    <div className={styles.categoryList}>
      <Link href="/blog?cat=coding" className={`${styles.categoryItem} ${styles.coding}`}> Coding
      </Link>

      <Link href="/blog?cat=travel" className={`${styles.categoryItem} ${styles.travel}`}> Travel
      </Link>

      <Link href="/blog?cat=food" className={`${styles.categoryItem} ${styles.food}`}> Cooking
      </Link>

      <Link href="/blog?cat=gardening" className={`${styles.categoryItem} ${styles.gardening}`}> Gardening
      </Link>

      <Link href="/blog?cat=other" className={`${styles.categoryItem} ${styles.other}`}> Other
      </Link>
    </div>

      <h2 className={styles.subtitle}>Chosen by the editor</h2>
      <h1 className={styles.title}>Editor's Pick</h1>
      <MenuPosts withImage />
    </div>
  );
};

export default Menu;
