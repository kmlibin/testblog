import {collection, addDoc, getDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore/lite'
import { db, storage } from '../config'
import { ref, deleteObject } from "firebase/storage";


export async function getCategories(){
    try {
        const collectionSnapshot = await getDocs(collection(db, "categories"));
        if (collectionSnapshot.empty) {
            throw new Error("Categories collection is empty");
          }
        if (collectionSnapshot) {
            const categories = collectionSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            return categories
        }
    } catch (error) {
        throw new Error("error fetching categories")
    }
}