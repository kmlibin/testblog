import React from "react";
import styles from "./featured.module.css";
import Image from "next/image";
import { BlogPostWithId } from "@/app/types";
import truncateHTMLText from "@/app/utils/truncateText";
import Link from "next/link";
import paths from "@/paths";

type FeaturedProps = {
  featured: BlogPostWithId | null;
  featuredError: string | null;
};
const Featured = ({ featured, featuredError }: FeaturedProps) => {
  let descriptionText = "";
  if (featured?.data.content) {
    descriptionText = truncateHTMLText(featured?.data?.content, 25);
  }
  //if featured is null or if featured error exists, return no content
  if (!featured) return null;

  if (featuredError) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <b>Hey, it's me!</b>
        Discover my stories and adventures
      </h1>
      <div className={styles.post}>
        <div className={styles.imgContainer}>
          <Image
            src={featured?.data?.coverImage?.url || "/p1.jpeg"}
            alt="image"
            fill
            className={styles.image}
          />
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.postTitle}>{featured?.data.title}</h1>
          <p className={styles.postDescription}>{descriptionText}</p>
          <Link
            href={paths.viewSinglePostPage(featured?.data?.slug, featured?.id)}
            className={styles.featuredLink}
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Featured;
