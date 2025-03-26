"use client"
import { BlogPostWithId } from "@/app/types";
import styles from "./tablecard.module.css";
import React, {useState} from "react";
import Image from "next/image";
import truncateHTMLText from "@/app/utils/truncateText";
import { formatDate } from "@/app/utils/formatDate";
import { MdOutlinePageview } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import Link from "next/link";
import paths from "@/paths";
import DeletePost from "@/components/deletePost/DeletePost";


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
        {/* <button
          data-tooltip="Delete Post"
          type="button"
          aria-label="delete post"
          onClick={() => handleDelete(post.id)}
          className={styles.singleIcon}
        >
          <RiDeleteBinLine />
        </button> */}
        <DeletePost format="icon" post={post} draft={post.data.draft === true ? "drafts" : "posts"}/>
      </div>
    </div>
  );
};

export default TableCard;
