"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal/Modal";
import Loading from "@/components/loading/Loading";
import styles from "./edit.module.css";
import { BlogPostWithId, CategoryWithId } from "@/app/types";
import { uploadImage } from "@/app/utils/uploadImage";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { MdUpload } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import Keywords from "@/app/createpost/Keywords";
import { ImagePath } from "@/app/types";
import EditAddImage from "@/app/edit/[postId]/editAddImages";
import { editPost } from "@/app/actions/posts";
import paths from "@/paths";
import MyPick from "@/components/myPick/MyPick";
import generateSlug from "@/app/utils/generateSlug";
import DraftSaveButtons from "@/components/draftSaveButtons/draftSaveButtons";

type EditPostProps = {
  categories: CategoryWithId[] | null;
  categoriesError: string | null;
  blogPostError: string | null;
  blogPost: BlogPostWithId | null;
};

type ImageFile = {
  url: string;
  file: File;
};

const Edit = ({
  categories,
  blogPostError,
  categoriesError,
  blogPost,
}: EditPostProps) => {
  const router = useRouter();
  const [myPick, setMyPick] = useState<boolean>(
    blogPost?.data?.myPick || false
  );
  const [featured, setFeatured] = useState<boolean>(
    blogPost?.data?.featured || false
  );
  const [prevCollection, setPrevCollection] = useState<string>(
    blogPost?.data?.draft ? "drafts" : "posts"
  );
  const [modalMessage, setModalMessage] = useState<string>("");
  const [postSlug, setPostSlug] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [content, setContent] = useState<string>(blogPost?.data?.content || "");
  const [firebaseCoverImage, setFirebaseCoverImage] =
    useState<ImagePath | null>(blogPost?.data?.coverImage || null);
  const [coverImage, setCoverImage] = useState<ImageFile | any>(null);
  const [firebaseAdditionalImages, setFirebaseAdditionalImages] = useState<
    ImagePath[] | null
  >(blogPost?.data?.additionalImages || null);
  const [additionalImages, setAdditionalImages] = useState<ImageFile[]>([]);
  const [title, setTitle] = useState<string>(blogPost?.data.title || "");
  const [catSlug, setCatSlug] = useState<string>(blogPost?.data.category || "");
  const [keywords, setKeywords] = useState<string[]>(
    blogPost?.data?.tags || []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [draft, setDraft] = useState<boolean>(blogPost?.data?.draft || false);
  const [postId, setPostId] = useState<string>(blogPost?.id || "");
  const [returnedDraft, setReturnedDraft] = useState<string>("");


  const MAX_FILE_SIZE = 3 * 1024 * 1024;
  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];

  //upload for the cover photo
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;

    //checks file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert("Invalid file type. Please upload a JPEG or PNG image.");
      return;
    }
    //checks file size
    if (file.size > MAX_FILE_SIZE) {
      alert("File is too large. Please upload an image smaller than 3MB.");
    }

    setCoverImage({
      url: URL.createObjectURL(file),
      file: file,
    });
  };
  console.log(prevCollection);
  //uploads for array of images
  const handleAdditionalImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.target.files ? Array.from(e.target.files) : [];

    files.forEach((file) => {
      //checks file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        alert("Invalid file type. Please upload a JPEG or PNG image.");
        return;
      }
      //checks file size
      if (file.size > MAX_FILE_SIZE) {
        alert("File is too large. Please upload an image smaller than 3MB.");
      } else {
        const url = URL.createObjectURL(file);
        setAdditionalImages((prevImages) => [...prevImages, { url, file }]);
      }
    });
  };

  //checkbox for my pick
  const handleMyPickChange = () => {
    setMyPick((prev) => !prev);
  };
  //box for featured
  const handleFeaturedChange = () => {
    setFeatured((prev) => !prev);
  };

  //edits blog post in firebase
  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // get image url and path for cover and additional photos
    try {
      let newCoverUrl: { url: string; path: string } | undefined = undefined;
      let newImageUrls: { url: string; path: string }[] = [];
      let imageUrls;

      // upload new images and get their URLs and paths
      if (additionalImages.length > 0) {
        newImageUrls = await Promise.all(
          additionalImages.map((image) => uploadImage(image.file))
        );
      }

      if (coverImage) {
        newCoverUrl = await uploadImage(coverImage.file);
      }

      if (firebaseCoverImage) {
        newCoverUrl = {
          url: firebaseCoverImage.url,
          path: firebaseCoverImage.path,
        };
      }

      // Combine existing and new image URLs and paths
      imageUrls = [...(firebaseAdditionalImages ?? []), ...newImageUrls];

      //create object that now includes the urls
      const post = {
        featured: featured,
        myPick: myPick,
        title: title,
        category: catSlug,
        categoryColor: blogPost?.data?.categoryColor,
        categoryName: blogPost?.data.categoryName || "",
        content: content,
        draft: draft,
        tags: keywords,
        views: 0,
        coverImage: newCoverUrl,
        additionalImages: imageUrls,
        slug: generateSlug(title),
      };

      //call server action, editpost
      const response = await editPost(postId, post, prevCollection);
      //if successful
      if (response?.error === false) {
        const { message, slug, draft } = response;
        console.log("response", response);
        setLoading(false);
        setSuccess(true);
        setModalMessage(message);
        setPostSlug(slug ? slug : "/");
        setReturnedDraft(draft || "");
        setShowModal(true);

        //clear state values
        setTitle("");
        setContent("");
        setCoverImage(null);
        setAdditionalImages([]);
        setKeywords([]);
        setDraft(false);
      }
      //if unsuccessful
      if (response?.error === true) {
        const { message } = response;
        setLoading(false);
        setSuccess(false);
        setModalMessage(message);
        setShowModal(true);
        console.log(message);
      }
    } catch (error: any) {
      console.log("error adding product");
      setLoading(false);
      setSuccess(false);
      setModalMessage(error.message);
      setShowModal(true);
    }
  };
  console.log("returned draft outside", returnedDraft);
  const closeModal = () => {
    console.log("runs");
    setShowModal(false);
    if (success == true && postSlug) {
      router.push(paths.viewSinglePostPage(postSlug, postId, returnedDraft));
    }
  };

  //if blogpost error, return and display error on frontend
  if (blogPostError) {
    return <div className={styles.error}>Error fetching Post...</div>;
  }

  return (
    <div className={styles.container}>
      <Loading label="Adding blog to database..." isLoading={loading} />
      <form className={styles.form} onSubmit={handleEdit}>
        {/* //title */}
        <input
          type="text"
          placeholder={title}
          className={styles.input}
          onChange={(e) => setTitle(e.target.value)}
        />
        {draft && <p className={styles.showDraft}>DRAFT</p>}

        {/* //categories */}
        {categoriesError && (
          <div className={styles.error}>Error fetching sections...</div>
        )}
        {categories !== null && (
          <select
            required
            className={styles.select}
            onChange={(e) => setCatSlug(e.target.value)}
            value={catSlug}
          >
            <option disabled value="">
              Select Category
            </option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
        {/* Photo Uploads */}
        <EditAddImage
          firebaseCoverImage={firebaseCoverImage}
          setFirebaseCoverImage={setFirebaseCoverImage}
          firebaseAdditionalImages={firebaseAdditionalImages}
          setFirebaseAdditionalImages={setFirebaseAdditionalImages}
          handleCoverImageUpload={handleCoverImageUpload}
          handleAdditionalImageUpload={handleAdditionalImageUpload}
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          additionalImages={additionalImages}
          setAdditionalImages={setAdditionalImages}
        />

        <div className={styles.editor}>
          <ReactQuill
            className={styles.textArea}
            theme="snow"
            value={content}
            onChange={setContent}
          />
        </div>
        <Keywords keywords={keywords} setKeywords={setKeywords} />
        <MyPick
          type="featured"
          toggle={featured}
          handleCheckboxChange={handleFeaturedChange}
        />
        <MyPick
          type="myPick"
          toggle={myPick}
          handleCheckboxChange={handleMyPickChange}
        />
        <DraftSaveButtons type="edit" loading={loading} setDraft={setDraft} />
      </form>
      <Modal show={showModal} onClose={closeModal}>
        <div>
          <p>{modalMessage}</p>
        </div>
      </Modal>
    </div>
  );
};

export default Edit;
