"use client";
import React, { useEffect, useState } from "react";
import styles from "./editAddImages.module.css";
import Image from "next/image";
import { ImageFile, ImagePath } from "@/app/types";
//firebase storage
import { ref, deleteObject } from "firebase/storage";
import { storage } from "@/app/firebase/config";

type EditAddImageProps = {
  firebaseCoverImage: ImagePath | null;
  setFirebaseCoverImage: React.Dispatch<React.SetStateAction<ImagePath | null>>,
  firebaseAdditionalImages: ImagePath[] | null;
  setFirebaseAdditionalImages: React.Dispatch<React.SetStateAction<ImagePath[] | null>>
  coverImage: ImageFile | null;
  setCoverImage: React.Dispatch<React.SetStateAction<ImageFile | null>>;
  additionalImages: ImageFile[];
  setAdditionalImages: React.Dispatch<React.SetStateAction<ImageFile[]>>;
  handleAdditionalImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCoverImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const EditAddImage = ({
  firebaseCoverImage,
  firebaseAdditionalImages,
  setFirebaseCoverImage,
  setFirebaseAdditionalImages,
  coverImage,
  setCoverImage,
  additionalImages,
  setAdditionalImages,
  handleAdditionalImageUpload,
  handleCoverImageUpload,
}: EditAddImageProps) => {
    const [numOfImages, setNumOfImages] = useState<number>(0);
    const [useURLForCoverImage, setUseURLForCoverImage] = useState<string>("");
    
console.log(coverImage, firebaseCoverImage)
    useEffect(() => {
      const url = determineURL()
      if (url) {
        setUseURLForCoverImage(url);
      }
      }, [coverImage, firebaseCoverImage]);

    const determineURL = () => {
        if (firebaseCoverImage && firebaseCoverImage.url !== "") return firebaseCoverImage.url;
        if (coverImage) return coverImage.url;
        return ""; 
      };


    useEffect(() => {
      // calculate total images between firebase images and new images
      if (firebaseAdditionalImages) {
        setNumOfImages(additionalImages.length + firebaseAdditionalImages.length);
      } else {
        setNumOfImages(additionalImages.length);
      }
    }, [additionalImages, firebaseAdditionalImages]);
  
    const removeImage = (index: number, url: string, path?: string) => {
        const isFirebaseUrl = url.includes("firebase")
        if (isFirebaseUrl) {
            const imageRef = ref(storage, path);
            deleteObject(imageRef).then(() => {
              console.log("deleted google storage photo");
            });
          setFirebaseAdditionalImages((prevImages) => prevImages?.filter((_, i) => i !== index) || []);
        } else {
          setAdditionalImages((prevImages) => prevImages.filter((_, i) => i !== index));
        }
      };

      const removeCoverImage = ( url: string, path?: string) => {
        const isFirebaseUrl = url.includes("firebase")
        if (isFirebaseUrl) {
            const imageRef = ref(storage, path);
            deleteObject(imageRef).then(() => {
              console.log("deleted google storage photo");
            });
          setFirebaseCoverImage(null);
        } else {
          setCoverImage(null);
        }
      };


  const handleAdditionalImageClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation(); // Stop the click event from propagating to the form
    const inputElement = document.getElementById(
      "additionalImagesUpload"
    ) as HTMLInputElement | null;
    if (inputElement) {
      inputElement.click();
    }
  };

  const handleCoverImageClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const inputElement = document.getElementById(
      "coverImageUpload"
    ) as HTMLInputElement | null;
    if (inputElement) {
      inputElement.click();
    }
  };

  return (
    <div className={styles.allImagesContainer}>
    <div className={styles.coverPhotoContainer}>
      {!coverImage && !firebaseCoverImage ? (
        <div className={styles.placeholderContainer}>
          <input
            type="file"
            id="coverImageUpload"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleCoverImageUpload}
          />

          <div className={styles.placeholderImage}>
            <Image
              src="/images.svg"
              alt="Cover photo placeholder"
              width={350}
              height={200}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button
              onClick={handleCoverImageClick}
              className={styles.addButton}
            >
              <Image
                src="/plus.png"
                alt="Add Cover Photo"
                width={24}
                height={24}
              />
            </button>
            <span>Add Cover Image</span>
          </div>
        </div>
      ) : (
        <div className={styles.coverPhoto}>
          <div className={styles.imageContainer}>
            <Image
               src={useURLForCoverImage && useURLForCoverImage !== "" ? useURLForCoverImage : "/images.svg"}
              alt="image"
              width={400}
              height={300}
              className={styles.image}
            />
          </div>
          <button
            className={styles.removeButton}
            onClick={() => removeCoverImage(useURLForCoverImage, firebaseCoverImage?.path)}
            
          >
            Remove
          </button>
        </div>
      )}
    </div>

    {/* Additional Images Upload */}
    <div className={styles.additionalImagesContainer}>
      <div className={styles.imageThumbnails}>
        {numOfImages === 0
          ? // display placeholders when no images are uploaded
            [...Array(3)].map((_, index) => (
              <div key={index} className={styles.thumbnailContainer}>
                <Image
                  src="/images.svg"
                  alt={`Placeholder ${index + 1}`}
                  width={200}
                  height={150}
                  className={styles.placeholderImage}
                />
              </div>
            ))
          : // show uploaded images
          [...(firebaseAdditionalImages || []), ...additionalImages].slice(0, 3).map((image, index) => (
              <div key={index} className={styles.thumbnailContainer}>
                <Image
                  src={image?.url}
                  alt={`Image ${index + 1}`}
                  width={300}
                  height={200}
                  className={styles.additionalImage}
                />
                <button
                  className={styles.removeButton}
                  onClick={() => removeImage(index, image.url, "path" in image ? image.path : undefined)}
                >
                  Remove
                </button>
              </div>
            ))}
      </div>

      {/* Upload Button */}
      <input
        type="file"
        id="additionalImagesUpload"
        style={{ display: "none" }}
        accept="image/*"
        multiple
        onChange={handleAdditionalImageUpload}
      />
      {numOfImages < 3 && (
        <div className={styles.buttonContainer}>
          <button
            className={styles.addButton}
            onClick={handleAdditionalImageClick}
          >
            <Image src="/plus.png" alt="Add Image" width={24} height={24} />
          </button>
          <span>Add Additional Images</span>
        </div>
      )}
    </div>
  </div>
  );
};

export default EditAddImage;
