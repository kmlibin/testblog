"use client"

import React from "react";
import Image from "next/image";
import styles from "./navbar.module.css";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";
import ThemeToggle from "../themeToggle/ThemeToggle";
import AdminButtons from "../adminButtons/AdminButtons";
import { useAuth } from "@/context/AuthContext";
const Navbar = () => {

  const {user} = useAuth()

  return (
    <div className={styles.container}>
      <div className={styles.social}>
        <Image src="/facebook.png" alt="facebook" width={24} height={24} />
        <Image src="/instagram.png" alt="instagram" width={24} height={24} />
        <Image src="/tiktok.png" alt="tiktok" width={24} height={24} />
        <Image src="/youtube.png" alt="youtube" width={24} height={24} />
      </div>
      <div className={styles.logo}>testblog</div>
      <div className={styles.links}>
        <ThemeToggle />
        <Link className={styles.link} href="/">HomePage</Link>
        <Link className={styles.link} href="/contact">Contact</Link>
        <Link className={styles.link} href="/about">About</Link>
        {user.isAdmin && <AdminButtons/>}
      </div>
    </div>
  );
};

export default Navbar;
