"use client";
import React, { useEffect, useState, useCallback } from "react";
import styles from "./admindashboard.module.css";
import { BlogPostWithId, CategoryWithId } from "@/app/types";
import Card from "@/components/card/Card";
import { useSearchParams } from "next/navigation";
import { getActiveBlogPosts } from "@/app/firebase/queries/blogPostQueries";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { getCategories } from "@/app/firebase/queries/sectionQueries";
import { getPicks } from "@/app/firebase/queries/picksQueries";
import getFeatured from "@/app/firebase/queries/featuredQueries";
import TableCard from "./TableCard";
import ManageCategories from "./ManageCategories";

type AdminDashboardProps = {
  myPicks: BlogPostWithId[] | null;
  myPicksError: string | null;
  featuredPostError: string | null;
  featuredPost: BlogPostWithId | null;
  categories: CategoryWithId[] | null;
  categoriesError: string | null;
};

export function debounce(func: any, wait: any) {
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<string>("posts");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [category, setCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [limitCount, setLimitCount] = useState(5);
  const [posts, setPosts] = useState<BlogPostWithId[] | null>(null);
  const [postsError, setPostsError] = useState<string | null>(null);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  console.log("featuredPost", featuredPost, featuredPostError);
  useEffect(() => {
    const status = searchParams.get("status");
    const searchQueryCategory = searchParams.get("category");
    const order = searchParams.get("sortOrder");
    if (status) {
      setActiveTab(status);
    }
    if (category) {
      setCategory(searchQueryCategory || "");
    }
    if (order) {
      setSortOrder(order);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
   
      try {   
  
 const posts = await getActiveBlogPosts(
          currentPage,
          limitCount,
          activeTab,
          sortOrder,
          category
        );
        if (posts.error) {
          setPostsError(posts.error);
          setPosts(null)
        } else {
          setPosts(posts.data);
          setPostsError(null);
        }     
       
      } catch (err: any) {
        setPosts(null)
        setPostsError(err.message);
      }
    };

    fetchProducts();
  }, [activeTab, currentPage, limitCount, sortOrder, category]);

  // section change
  const handleSectionChange = (value: string) => {
    setCategory(value);
    router.push(pathname + "?" + createQueryString("category", value));
  };
  return (

    <div className={styles.container}>
      <div className={styles.dashboardContainer}>
      <div className={styles.dashboardTabs}>
      {/* active/draft tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "posts" ? styles.active : ""
          }`}
          onClick={() => {
            setActiveTab("posts"),
              router.push(
                pathname + "?" + createQueryString("status", "posts")
              );
          }}
        >
          Active Posts
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "drafts" ? styles.active : ""
          }`}
          onClick={() => {
            setActiveTab("drafts"),
              router.push(
                pathname + "?" + createQueryString("status", "drafts")
              );
          }}
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
            router.push(
              pathname + "?" + createQueryString("sortOrder", e.target.value)
            );
          }}
        >
          <option value="desc">Sort by Most Recent</option>
          <option value="asc">Sort by Oldest First</option>
        </select>

        <select
          className={styles.dropdown}
          value={category ? category : ""}
          onChange={(e) => {
            handleSectionChange(e.target.value);
          }}
        >
          <option value="all">All</option>
          {categories?.map((category) => (
            <option value={category.name}>{category.name}</option>
          ))}
        </select>
      </div>
      
</div>
<ManageCategories categories={categories}/>
</div>
      {/* posts */}
      <div className={styles.dataContainer}>
      {featuredPostError && <div>{featuredPostError}</div>}
        {featuredPost && (
        <div className={styles.tableCardContainer}>
          <h2 className={styles.title}>Featured Post</h2>
            <TableCard post = {featuredPost}/>
       </div>
        )}
        {myPicksError && <div>{myPicksError}</div>}
        {myPicks && (
         <div className={styles.tableCardContainer}>
            <h2 className={styles.title}>My Picks</h2>
            {myPicks.map((pick) => (
              <TableCard post={pick} />
            ))}
          </div>
        )}
        {postsError && <div>{postsError}</div>}
        {posts && (
         <div className={styles.tableCardContainer}>
            <h2 className={styles.title}>Posts</h2>
            {posts.map((post) => (
              <TableCard post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
