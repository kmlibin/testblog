
"use client"
import { useState } from "react";
import Link from "next/link";
import styles from "./adminButtons.module.css";
import { TbCaretDown } from "react-icons/tb";

const AdminDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={styles.dropdown} 
      onMouseEnter={() => setIsOpen(true)} 
      onMouseLeave={() => setIsOpen(false)}
    >
      <span className={styles.admin}>Admin <TbCaretDown /></span>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <Link href="/admin/dashboard" className={styles.dropdownLink}>Dashboard</Link>
          <Link href="/admin/settings" className={styles.dropdownLink}>Settings</Link>
        </div>
      )}
    </div>
  );
};

export default AdminDropdown;
