"use server"

import {collection, addDoc, getDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore/lite'
import { db, storage } from '../firebase/config'
import { ref, deleteObject } from "firebase/storage";


export async function createBlogPost(post) {
    try {
 
      const docRef = await addDoc(collection(db, "posts"), post);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding post to Firestore:', error);
      throw new Error('Failed to create post');
    }
  }