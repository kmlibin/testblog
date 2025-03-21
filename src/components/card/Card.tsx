import React from "react";
import styles from "./card.module.css";
import Image from "next/image";
import Link from "next/link";
import { BlogPostWithId } from "@/app/types";
import { formatDate } from "@/app/utils/formatDate";
import truncateHTMLText from "@/app/utils/truncateText";
import paths from "@/paths";


type CardProps = {
  post: BlogPostWithId;
}
const Card = ({post}:CardProps) => {
  let descriptionText
  let formattedDate
  if(post && post.data.date) {
    formattedDate = formatDate(post.data.date)
  }

  if(post) {
    descriptionText = truncateHTMLText(post.data.content, 25)
  }

  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <Image src={post?.data?.coverImage?.url || "/p1.jpeg"} alt="image" fill className={styles.image} />
      </div>
      <div className={styles.textContainer}>
        <div className={styles.detail}>
          <span className={styles.date}>{formattedDate} - </span>
          <span className={styles.category}>{post.data.categoryName}</span>
        </div>
        <Link href={paths.viewSinglePostPage(post.data.slug, post.id, "false")}>
          <h1 className={styles.title}>
           {post.data.title}
          </h1>
        </Link>
        <p className={styles.desc}>
          {descriptionText}
        </p>
        <Link href={paths.viewSinglePostPage(post.data.slug, post.id, "false"  )} className={styles.link}>
          Read More
        </Link>
      </div>
    </div>
  );
};

export default Card;
