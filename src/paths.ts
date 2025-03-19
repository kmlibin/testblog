const paths = {
  homePage() {
    return "/";
  },
  editPostPage(postId: string) {
    return `/edit/${postId}`;
  },
  createPostPage() {
    return "/createpost";
  },
  viewSinglePostPage(singlePageSlug: string, postId: string) {
    return `/${singlePageSlug}?id=${postId}`
  },
  viewAllPostsPage() {
    return `/allposts`;
  },
  viewCategoryPage(categoryName: string, category: string) {
    return `/category/${categoryName}?id=${category}`
  }
};

export default paths;
