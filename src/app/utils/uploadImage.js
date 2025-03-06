'use client'

//fb storage for images
import { storage } from "@/app/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const generateRandomNumber = () => {
  return Math.floor(100 + Math.random() * 900);
};

//must keep in client? in server, it doesn't like that i pass back the urls for some reason, says it doesn't like [File]. right now in two, put in a diff file and clean up
export const uploadImage = async (file) => {
  if (!file || !(file instanceof File)) {
    console.error("Invalid file:", file);
    throw new Error("Invalid file uploaded");
  }

  try {
    console.log("Uploading image:", file);
    //create image name
    const imageName = file.name;
    const uniqueName = `${imageName}-${generateRandomNumber()}`;
    //referene to the location whree image will be stored.
    const imageRef = ref(storage, `images/${uniqueName}`);
    console.log("Image reference:", imageRef);

    // uploads the file to the place we told it to go
    await uploadBytes(imageRef, file, { contentType: file.type });

    //after it uploads, we need to get the url so we can store it with the associated product in firestore
    const imageUrl = await getDownloadURL(imageRef);
    console.log("Image URL:", imageUrl);
console.log(imageUrl, `images/${uniqueName}`)
    return { url: imageUrl, path: `images/${uniqueName}` };
  } catch (error) {
    throw new Error("Error uploading images");
  }
};
