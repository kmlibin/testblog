"use client";
import React, { useEffect, useState, useCallback } from "react";
import styles from "./admindashboard.module.css";
import { BlogPostWithId, CategoryWithId } from "@/app/types";
import Card from "@/components/card/Card";
import { useSearchParams } from "next/navigation";
import { getActiveBlogPosts } from "@/app/firebase/queries/blogPostQueries";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";


type AdminDashboardProps = {
  // blogPostError: string | null;
  // blogPost: BlogPostWithId | null;
  myPicks: BlogPostWithId[] | null;
  myPicksError: string | null;
  featuredPostError: string | null;
  featuredPost: BlogPostWithId | null;
  categories: CategoryWithId[] | null;
  categoriesError: string | null;
};

export  function debounce(func: any, wait: any) {
  let timeout: any;
  return function (...args: any) {
    clearTimeout(timeout);
    //@ts-ignore
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}


const AdminDashboard = ({
  myPicks,
  myPicksError,
  featuredPost,
  featuredPostError,
  categories,
  categoriesError,
}: AdminDashboardProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [activeTab, setActiveTab] = useState<string>("posts");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [category, setCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1)
  const [limitCount, setLimitCount] = useState(5)
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
 
      return params.toString()
    },
    [searchParams]
  )

  console.log(searchParams)
  useEffect(() => {
    const status = searchParams.get("status")
    const searchQueryCategory = searchParams.get("category")
    const order = searchParams.get("sortOrder")
    if(status) {
      setActiveTab(status)
    }
    if(category) {
      setCategory(searchQueryCategory || "")
    }
    if(order) {
      setSortOrder(order)
    }
  }, [searchParams])


  useEffect(() => {
    const fetchProducts = async() => {
      try {
        const products = await getActiveBlogPosts(currentPage, limitCount, activeTab, sortOrder, category)
        console.log(products)
      } catch(err) {

      }
    }

    fetchProducts()
  }, [activeTab, currentPage, limitCount, sortOrder, category])

console.log(currentPage, limitCount)

  // section change
  const handleSectionChange = (value: string) => {
    setCategory(value);
    router.push(pathname + "?" + createQueryString("category", value));
  };
  return (
    <div className={styles.dashboard}>
      {/* active/draft tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "posts" ? styles.active : ""
          }`}
          onClick={() => {setActiveTab("posts"),  router.push(pathname + '?' + createQueryString('status', "posts"
          ))}}
        >
          Active Posts
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "drafts" ? styles.active : ""
          }`}
          onClick={() => {setActiveTab("drafts"),  router.push(pathname + '?' + createQueryString('status', "drafts"
          ))}}
        >
          Drafts
        </button>
      </div>

      {/* sorting filters */}
      <div className={styles.filters}>
        <select
          className={styles.dropdown}
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            router.push(pathname + "?" + createQueryString("sortOrder", e.target.value));
          }}
        >
          <option value="desc">Sort by Most Recent</option>
          <option value="asc">Sort by Oldest First</option>
        </select>

        <select
          className={styles.dropdown}
          value={category ?  category : ""}
          onChange={(e) => {handleSectionChange(e.target.value)}}
        >
          <option value="all">All</option>
          {categories?.map((category) => (
            <option value={category.name}>{category.name}</option>
          ))}
        </select>
      </div>

      {/* posts */}
      <div className={styles.dataContainer}>
        {featuredPost && (
          <div>
            <h2>Featured Post</h2>
            <Card post={featuredPost} />
          </div>
        )}
        {myPicks && (
          <div>
            <h2>My Picks</h2>
            {myPicks.map((pick) => (
              <Card post={pick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
