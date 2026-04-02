import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/index.js";


/**
 * @param {string} book
 * @param {string} text
 * @param {string} authorID
 * @param {string} username
 * @param {boolean} isPublic
 * @param {string} [question]
 * @param {string | null} [imageUrl]
 */
export async function createPost(book, text, authorID, username, isPublic, question = "", imageUrl = null) {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      authorId: authorID,
      username: username,
      isPublic: isPublic,
      book: book,
      question: question,
      text: text,
      image: imageUrl,
      likeCount: 0, //new field to keep track of the number of likes on a post
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch {
    console.log("Error sending data");
  }
  return null;
}
