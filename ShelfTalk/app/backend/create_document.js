import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/index.js";

// consider making a unique data type of Posts with
// all the attributes of a post.

export async function createPost(book, text, authorID, isPublic) {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      authorId: authorID,
      isPublic: isPublic,
      book: book,
      text: text,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch {
    console.log("Error sending data");
  }
  return null;
}
