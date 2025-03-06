import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.information}>
        <div className={styles.logo}>
          <Image
            className={styles.image}
            alt=""
            src="/logo.png"
            width={50}
            height={50}
          />
          <h1 className={styles.logoText}>My Blog</h1>
        </div>
        <p className={styles.description}>
          description goes here. this is a description you should add.
          description goes here. this is a description you should
          add.description goes here. this is a description you should add.
        </p>
        <div className={styles.icons}>
          <Image src="/facebook.png" alt="facebook" width={18} height={18} />
          <Image src="/instagram.png" alt="instagram" width={18} height={18} />
          <Image src="/tiktok.png" alt="tiktok" width={18} height={18} />
          <Image src="/youtube.png" alt="youtube" width={18} height={18} />
        </div>
      </div>
      <div className={styles.links}>
        <div className={styles.list}>
          <span className={styles.listTitle}> Links</span>
          <Link href="/">Homepage</Link> <Link href="/">Blog</Link>{" "}
          <Link href="/">About</Link> <Link href="/">Contact</Link>{" "}
        </div>
        <div className={styles.list}>
          <span className={styles.listTitle}> Tags</span>
          <Link href="/">Travel</Link> <Link href="/">Other</Link>{" "}
          <Link href="/">Coding</Link> <Link href="/">Food</Link>{" "}
        </div>
        <div className={styles.list}>
          <span className={styles.listTitle}> Social</span>
          <Link href="/">Facebook</Link> <Link href="/">TikTok</Link>{" "}
          <Link href="/">Youtube</Link> <Link href="/">Instagram</Link>{" "}
        </div>
      </div>
    </div>
  );
};

export default Footer;
