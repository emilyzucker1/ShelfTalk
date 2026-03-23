import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/index.js";

// consider making a unique data type of Posts with
// all the attributes of a post.

export async function createPost(book, text, authorID) {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      authorId: authorID,
      book: book,
      text: text,
    });
  } catch {
    console.log("Error sending data");
  }
  return 0;
}
