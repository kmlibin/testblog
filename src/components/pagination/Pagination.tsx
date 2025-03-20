'use client'
import React from "react";
import styles from "./pagination.module.css";
import { useRouter, useParams } from "next/navigation";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
}

const Pagination = ({currentPage, totalPages} : PaginationProps) => {
  const router = useRouter()
  const params = useParams()

  const handlePageChange = (page: number) => {
    if (totalPages !== undefined) {
      if (page > 0 && page <= totalPages) {
        router.push(`/?page=${page}`);
      }
    }
  };

  return (
    <div className={styles.container}>
           <button className={styles.button}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
