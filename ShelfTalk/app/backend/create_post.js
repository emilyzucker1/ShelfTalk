import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/index.js";


export async function createPost(book, text, authorID, username, isPublic, question = "") {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      authorId: authorID,
      username: username,
      isPublic: isPublic,
      book: book,
      question: question,
      text: text,
      likeCount: 0, //new field to keep track of the number of likes on a post
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch {
    console.log("Error sending data");
  }
  return null;
}
