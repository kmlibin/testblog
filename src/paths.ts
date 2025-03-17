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
  viewSinglePostPage(singlePageSlug: string) {
    return `/${singlePageSlug}`;
  },
  viewEditedSinglePostPage(singlePageSlug: string, postId: string) {
    return `/${singlePageSlug}?id=${postId}`
  },
  viewAllPostsPage() {
    return `/allposts`;
  },
};

export default paths;
