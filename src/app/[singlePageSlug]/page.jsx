import React from "react";
import styles from "./singlePage.module.css";
import Menu from "@/components/menu/Menu";
import Image from "next/image";

const page = () => {
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit
          </h1>
          <div className={styles.user}>
            <div className={styles.userImageContainer}>
              <Image src="/p1.jpeg" alt="" fill className={styles.userImage} />
            </div>
            <div className={styles.userTextContainer}>
              <span className={styles.username}>Author Name</span>
              <span className={styles.date}>Date Here</span>
            </div>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <Image alt="" fill src="/p1.jpeg" className={styles.image} />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.post}>
          <div className={styles.description}>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint
              aliquid maiores dolor vitae nam expedita molestiae aperiam
              assumenda eveniet inventore eius aspernatur modi in dolorum, quas
              vero corporis tempore dignissimos!
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint
              aliquid maiores dolor vitae nam expedita molestiae aperiam
              assumenda eveniet inventore eius aspernatur modi in dolorum, quas
              vero corporis tempore dignissimos!
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint
              aliquid maiores dolor vitae nam expedita molestiae aperiam
              assumenda eveniet inventore eius aspernatur modi in dolorum, quas
              vero corporis tempore dignissimos!
            </p>
          </div>
        </div>
        <Menu />
      </div>
    </div>
  );
};

export default page;
