import React from "react";
import styles from "./categorylist.module.css";
import Link from "next/link";
import Image from "next/image";
const CategoryList = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Popular Categories</h1>
      <div className={styles.categories}>
      
          <Link href="/blog?cat=style" className={`${styles.category} ${styles.style}`}>
            <Image
              src="/style.png"
              alt="style"
              width={32}
              height={32}
              className={styles.image}
            />
            Travel
          </Link>

          <Link href="/blog?cat=style" className={`${styles.category} ${styles.coding}`}>
            <Image
              src="/coding.png"
              alt="style"
              width={32}
              height={32}
              className={styles.image}
            />
            Coding
          </Link>

          <Link href="/blog?cat=style" className={`${styles.category} ${styles.food}`}>
            <Image
              src="/food.png"
              alt="style"
              width={32}
              height={32}
              className={styles.image}
            />
           Cooking
          </Link>

          <Link href="/blog?cat=style" className={`${styles.category} ${styles.garden}`}>
            <Image
              src="/fashion.png"
              alt="style"
              width={32}
              height={32}
              className={styles.image}
            />
            Garden
          </Link>

          <Link href="/blog?cat=style" className={`${styles.category} ${styles.other}`}>
            <Image
              src="/travel.png"
              alt="style"
              width={32}
              height={32}
              className={styles.image}
            />
            Other
          </Link>
    
      </div>
    </div>
  );
};

export default CategoryList;
