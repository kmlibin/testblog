const paths = {
  homePage() {
    return "/";
  },
  editPostPage(postId: string, draft: string, ) {
    return `/edit/${postId}/?draft=${draft}`;
  },
  createPostPage() {
    return "/createpost";
  },
  viewSinglePostPage(singlePageSlug: string, pageId: string, draft: string, ) {
    return `/viewPost/${singlePageSlug}/${pageId}/?draft=${draft}`
  },
  viewAllPostsPage() {
    return `/allposts`;
  },
  viewCategoryPage(categoryName: string, category: string) {
    return `/category/${categoryName}?id=${category}`
  },
  adminPage() {
    return `/admin/dashboard`
  }
};

export default paths;
