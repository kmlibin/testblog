"use client"
import React, {useState} from "react";
import styles from './delete.module.css'
import { BlogPostWithId } from "@/app/types";
import { useRouter } from "next/navigation";
import paths from "@/paths";
import Modal from "../modal/Modal";
import { RiDeleteBinLine } from "react-icons/ri";
import { deletePost } from "@/app/actions/posts";


type Props = {
    post: BlogPostWithId
    format: string;
    draft: string
};

const DeletePost = ({post, format, draft}: Props) => {

    const router = useRouter()
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [productIdToDelete, setProductIdToDelete] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const [success, setSuccess] = useState(false);

    const handleDelete = async (id: string) => {
        setProductIdToDelete(id);
        setShowConfirmModal(true);
      };
    
      //need to delete both path from additional images and from cover image
      const confirmDelete = async () => {
        let sectionPath = post.data.category|| "";
        setShowConfirmModal(false);
        //always pass it an array
        let imagePaths: string[] = [];
        if (post.data.additionalImages && post.data.additionalImages.length > 0) {
          // get the path and add it
          imagePaths = post.data.additionalImages?.map((image: any) => image.path);
        }
        if(post.data.coverImage) {
          let coverPath = post.data.coverImage.path
          imagePaths = [...imagePaths, coverPath]
        }

        console.log("imagepaths", imagePaths)
        const {error, message} = await deletePost(
          productIdToDelete,
          imagePaths,
          sectionPath,
          draft
        );
        console.log(`error = ${error}`)
        if (error == false) {
          setShowSuccessModal(true)
        }
        if (error == true) {
          setSuccess(false);
          setError(true);
          setModalMessage(message);
          setShowModal(true);
        }
      };
    

      const closeModal = () => {
        console.log(`success = ${success} error = ${error}`)
        setShowModal(false);
        if (success == true) {
          router.push("/");
        }
      };


  return (
    <>
    <button
    data-tooltip="Delete Post"
    onClick={() => handleDelete(post.id)}
    className={styles[format]}
  >
    {format === "formatButton"? ("Delete Product") : <RiDeleteBinLine /> }
  </button>

  {showConfirmModal && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <p>Are you sure you want to delete?</p>
      <div className={styles.modalContainer}>
        <button onClick={confirmDelete} className={`${styles.modalButton} ${styles.confirmButton}`}>
          Yes
        </button>
        <button onClick={() => setShowConfirmModal(false)} className={`${styles.modalButton} ${styles.cancelButton}`}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{/* Success modal */}
{showSuccessModal && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <p>Product deleted successfully!</p>
      <button
        className={`${styles.modalButton} ${styles.successButton}`}
        onClick={() => setShowSuccessModal(false)}
      >
        OK
      </button>
    </div>
  </div>
)}

<Modal show={showModal} onClose={closeModal}>
  <div>
    <p>{modalMessage}</p>
  </div>
</Modal>
</>
  )
}

export default DeletePost;
