import React from "react";
import styles from "./categorylist.module.css";
import Link from "next/link";
import Image from "next/image";
import { CategoryWithId } from "@/app/types";
import paths from "@/paths";

type CategoryListProps = {
  withImage: boolean;
  categories: CategoryWithId[] | null;
  categoriesError: string | null;
};
const CategoryList = ({
  withImage,
  categories,
  categoriesError,
}: CategoryListProps) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Popular Categories</h1>
      <div className={styles.categoryList}>
       
          {categoriesError && "Error fetching categories..."}
          {categories?.map((cat) => (
            <Link
              href={paths.viewCategoryPage(cat.name, cat.id)}
              className={styles.categoryItem}
              style={{ backgroundColor: cat.color }}
              key={cat.id}
            >
              {withImage && (
                <Image
                  src="/style.png"
                  alt="style"
                  width={32}
                  height={32}
                  className={styles.image}
                />
              )}
              <span className={styles.catTitle}>{cat.name}</span>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default CategoryList;
