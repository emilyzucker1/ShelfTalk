import { collection, getDocs, query, where, or } from "firebase/firestore";
import { db, userID } from "../firebase/index.js";

// add public and private attributes
export async function getUserPosts(authorId) {
  try {
    const q = query(collection(db, "posts"), or(where("authorId", "==", authorId), where("isPublic", "==", true)));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    console.log("Error fetching data:", e);
  }
}
