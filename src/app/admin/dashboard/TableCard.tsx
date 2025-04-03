"use client"
import { BlogPostWithId } from "@/app/types";
import styles from "./tablecard.module.css";
import React, {useState} from "react";
import Image from "next/image";
import truncateHTMLText from "@/app/utils/truncateText";
import { formatDate } from "@/app/utils/formatDate";
import { MdOutlinePageview } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { GrFavorite } from "react-icons/gr";
import Link from "next/link";
import paths from "@/paths";
import DeletePost from "@/components/deletePost/DeletePost";
import { GoStarFill } from "react-icons/go";


type Props = {
  post: BlogPostWithId;
};

const TableCard = ({ post }: Props) => {
  const { coverImage, categoryName, categoryColor, title, date, slug, draft } =
    post.data;
  let draftStatus = draft === true ? "true" : "false";

  const handleDelete = (postId: any) => {
    console.log("deleted");
  };

  console.log(post)
  return (
    <div className={styles.container}>
      <div className={styles.category}>
        <p
          style={{ backgroundColor: `${categoryColor}` }}
          className={styles.catName}
        >
          {categoryName}
        </p>
        <Image
          src={coverImage?.url || "/p1.jpeg"}
          alt="cover image"
          height={60}
          width={60}
        />
        {post.data.myPick && <GrFavorite />}
        {post.data.featured && <GoStarFill />}
      </div>
      <div className={styles.info}>
        <p>{truncateHTMLText(title, 8)}</p>
        <p className={styles.date}>{formatDate(date)}</p>
      </div>
      <div className={styles.icons}>
        <Link
          data-tooltip="View Post"
          href={paths.viewSinglePostPage(slug, post.id, draftStatus)}
          className={styles.singleIcon}
        >
          <MdOutlinePageview />
        </Link>
        <Link
          data-tooltip="Edit Post"
          href={paths.editPostPage(post.id, draftStatus)}
          className={styles.singleIcon}
        >
          <CiEdit />
        </Link>

        <DeletePost format="icon" post={post} draft={post.data.draft === true ? "drafts" : "posts"}/>
      </div>
    </div>
  );
};

export default TableCard;
