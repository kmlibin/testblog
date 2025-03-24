import { NextRequest, NextResponse } from "next/server";
import { BlogPost } from "@/app/types";
import { db } from "@/app/firebase/config";
import { getDoc, doc, Timestamp } from "firebase/firestore/lite";

export async function GET(req: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const draft = searchParams.get("draft");
console.log("draft", draft)
console.log("id", id)

if (!id) {
    return NextResponse.json({ status: 400, error: "Missing ID", data: null });
  }
  //figure out which collection to query
  const collection = draft === "true" ? "drafts" : "posts";
  const postRef = doc(db, collection, id);

  try {
    const postSnapshot = await getDoc(postRef);
    if (!postSnapshot.exists()) {
      return NextResponse.json({
        status: 404,
        error: "Post with that ID does not exist",
        data: null,
      });
    }
    if (postSnapshot) {
      const postData = postSnapshot.data() as BlogPost;

      // convert Firestore timestamps to plain JavaScript Date or string
      const formattedPostData = {
        ...postData,
        date:
          postData.date instanceof Timestamp
            ? postData.date.toDate().toISOString()
            : null,
        editedAt:
          postData.editedAt instanceof Timestamp
            ? postData.editedAt.toDate().toISOString()
            : null,
      };

      return NextResponse.json({
        status: 200,
        data: {
          id: postSnapshot.id,
          data: formattedPostData,
        },
        error: null,
      });
    }
    return NextResponse.json({ status: 500, data: null, error: "Error fetching post" });
  } catch (error: any) {
    console.log("error fetching post", error)
    return NextResponse.json({ status: 500, data: null, error: error.message });
  }
}
