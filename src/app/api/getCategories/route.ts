import { db } from "@/app/firebase/config";
import { getDocs, collection } from "firebase/firestore/lite";
import { CategoryWithId } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const collectionSnapshot = await getDocs(collection(db, "categories"));
    if (collectionSnapshot.empty) {
      return NextResponse.json({
        status: 404,
        error: "error fetching categories",
        categories: null,
      });
    }
    if (collectionSnapshot) {
      const categories: CategoryWithId[] = collectionSnapshot.docs.map(
        (doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            color: data.color,
            image: data.image,
            posts: data.posts,
          };
        }
      );

      return NextResponse.json({ status: 200, error: null, categories });
    }
    return NextResponse.json({
      status: 500,
      error: "Error fetching categories",
      categories: null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, categories: null });
  }
}
