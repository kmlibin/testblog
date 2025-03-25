"use client";
import React, { useState } from "react";
import styles from "./admindashboard.module.css";
import { BlogPostWithId, CategoryWithId } from "@/app/types";
import Card from "@/components/card/Card";

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

const AdminDashboard = ({
  myPicks,
  myPicksError,
  featuredPost,
  featuredPostError,
  categories,
  categoriesError,
}: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<"active" | "drafts">("active");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [category, setCategory] = useState<string>("all");
  console.log(activeTab, sortOrder, category);
  console.log(featuredPost);
  return (
    <div className={styles.dashboard}>
      {/* active/draft tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "active" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("active")}
        >
          Active Posts
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "drafts" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("drafts")}
        >
          Drafts
        </button>
      </div>

      {/* sorting filters */}
      <div className={styles.filters}>
        <select
          className={styles.dropdown}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "recent" | "oldest")}
        >
          <option value="recent">Sort by Most Recent</option>
          <option value="oldest">Sort by Oldest First</option>
        </select>

        <select
          className={styles.dropdown}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All</option>
          {categories?.map((category) => (
            <option value={category.id}>{category.name}</option>
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
