import React from "react";
import styles from "./editPostButton.module.css";
import Link from "next/link";
import paths from "@/paths";

type EditPostButtonProps = {
  postId: string;
  draft: string;
};

const EditPostButton = ({ postId, draft }: EditPostButtonProps) => {
  return (
    <div className={styles.container}>
      <Link href={paths.editPostPage(postId, draft)} className={styles.edit}>Edit Post</Link>
    </div>
  );
};

export default EditPostButton;
