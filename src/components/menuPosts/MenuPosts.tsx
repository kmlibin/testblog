import React from "react";
import styles from "./menuPosts.module.css";
import Link from "next/link";
import Image from "next/image";

const MenuPosts = ({ withImage }) => {
  return (
    <div className={styles.items}>
      <Link href="/" className={styles.item}>
        {withImage && (
          <div className={styles.imageContainer}>
            <Image src="/p1.jpeg" alt="" fill className={styles.image} />
          </div>
        )}
        <div className={styles.textContainer}>
          <span className={`${styles.category} ${styles.travel}`}>Travel</span>
          <h3 className={styles.postTitle}>
            Nemo enim ipsam voluptatem quia voluptas
          </h3>
          <div className={styles.detail}>
            <span className={styles.username}>Author Name</span>
            <span className={styles.date}> - 9.06.2024</span>
          </div>
        </div>
      </Link>

      <Link href="/" className={styles.item}>
        {withImage && (
          <div className={styles.imageContainer}>
            <Image src="/p1.jpeg" alt="" fill className={styles.image} />
          </div>
        )}
        <div className={styles.textContainer}>
          <span className={`${styles.category} ${styles.coding}`}>Coding</span>
          <h3 className={styles.postTitle}>
            Nemo enim ipsam voluptatem quia voluptas
          </h3>
          <div className={styles.detail}>
            <span className={styles.username}>Author Name</span>
            <span className={styles.date}> - 9.06.2024</span>
          </div>
        </div>
      </Link>

      <Link href="/" className={styles.item}>
        {withImage && (
          <div className={styles.imageContainer}>
            <Image src="/p1.jpeg" alt="" fill className={styles.image} />
          </div>
        )}
        <div className={styles.textContainer}>
          <span className={`${styles.category} ${styles.food}`}>Cooking</span>
          <h3 className={styles.postTitle}>
            Nemo enim ipsam voluptatem quia voluptas
          </h3>
          <div className={styles.detail}>
            <span className={styles.username}>Author Name</span>
            <span className={styles.date}> - 9.06.2024</span>
          </div>
        </div>
      </Link>

      <Link href="/" className={styles.item}>
        {withImage && (
          <div className={styles.imageContainer}>
            <Image src="/p1.jpeg" alt="" fill className={styles.image} />
          </div>
        )}
        <div className={styles.textContainer}>
          <span className={`${styles.category} ${styles.other}`}>Other</span>
          <h3 className={styles.postTitle}>
            Nemo enim ipsam voluptatem quia voluptas
          </h3>
          <div className={styles.detail}>
            <span className={styles.username}>Author Name</span>
            <span className={styles.date}> - 9.06.2024</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MenuPosts;
