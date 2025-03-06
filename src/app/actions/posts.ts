"use server"



import {collection, addDoc, getDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore/lite'
import { db, storage } from '../firebase/config'
import { ref, deleteObject } from "firebase/storage";
import { BlogPost } from '../types';

interface SuccessResponse {
  error: false;
  message: string;
  id: string;
}

interface ErrorResponse {
  error: true;
  message: string;
}

type CreateBlogPostResponse = SuccessResponse | ErrorResponse;

export async function createBlogPost(post: BlogPost): Promise<CreateBlogPostResponse> {
    try {
 
      const docRef = await addDoc(collection(db, "posts"), post);
      return { error: false, message: "post successfully created", id: docRef.id };
    } catch (error) {
      console.error('Error adding post to Firestore:', error);
      return { error: true, message: "error adding post to firestore" };
    }
  }