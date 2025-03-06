"use client";
import React, { useState } from "react";
import styles from "./addimages.module.css";
import Image from "next/image";
import "react-quill/dist/quill.bubble.css";

type ImageFile = {
  url: string;
  file: File;
};

type AddImageProps = {
  coverImage: ImageFile | null;
  setCoverImage: React.Dispatch<React.SetStateAction<ImageFile | null>>;
  additionalImages: ImageFile[];
  setAdditionalImages: React.Dispatch<React.SetStateAction<ImageFile[]>>;
  handleAdditionalImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCoverImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const AddImage = ({
  coverImage,
  setCoverImage,
  additionalImages,
  setAdditionalImages,
  handleAdditionalImageUpload,
  handleCoverImageUpload,
}: AddImageProps) => {
  const removeImage = (index: number) => {
    setAdditionalImages((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
  };

  return (
    <div className={styles.allImagesContainer}>
      <div className={styles.coverPhotoContainer}>
        {!coverImage ? (
          <div className={styles.placeholderContainer}>
            <div className={styles.buttonContainer}>
              <button
                 onClick={() => {
                  const inputElement = document.getElementById("coverImageUpload") as HTMLInputElement | null;
                  if (inputElement) {
                    inputElement.click();
                  }
                }}
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
          </div>
        ) : (
          <div className={styles.coverPhoto}>
            <div className={styles.imageContainer}>
              <Image
                src={coverImage.url}
                alt="image"
                layout="intrinsic"
                width={400}
                height={300}
                className={styles.image}
              />
            </div>
            <button
              className={styles.removeButton}
              onClick={() => setCoverImage(null)}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Additional Images Upload */}
      <div className={styles.additionalImagesContainer}>
        <div className={styles.imageThumbnails}>
          {additionalImages.length === 0
            ? // display placeholders when no images are uploaded
              [...Array(3)].map((_, index) => (
                <div key={index} className={styles.thumbnailContainer}>
                  <Image
                    src="/additionalimages.svg"
                    alt={`Placeholder ${index + 1}`}
                    width={200}
                    height={150}
                    className={styles.placeholderImage}
                  />
                </div>
              ))
            : // show uploaded images
              additionalImages.map((image, index) => (
                <div key={index} className={styles.thumbnailContainer}>
                  <Image
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    width={300}
                    height={200}
                    className={styles.additionalImage}
                  />
                  <button
                    className={styles.removeButton}
                    onClick={() => removeImage(index)}
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
        {additionalImages.length < 3 && (
          <div className={styles.buttonContainer}>
            <button className={styles.addButton}>
              <label htmlFor="additionalImagesUpload">
                <Image src="/plus.png" alt="Add Image" width={24} height={24} />
              </label>
            </button>
            <span>Add Additional Images</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddImage;
