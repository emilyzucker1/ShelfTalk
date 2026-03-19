import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/index.js";

/**
 * Delete a post document by ID from the `posts` collection.
 * @param {string} postId
 * @returns {Promise<boolean>} true if deleted, false on error
 */
export async function deletePost(postId) {
  if (!postId) {
    const msg = "deletePost: missing postId";
    console.log(msg);
    return { ok: false, error: msg };
  }

  try {
    await deleteDoc(doc(db, "posts", postId));
    return { ok: true };
  } catch (err) {
    console.log("Error deleting post:", err);
    return { ok: false, error: err?.message || String(err) };
  }
}