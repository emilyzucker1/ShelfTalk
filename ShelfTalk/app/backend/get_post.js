import { collection, getDocs, or, query, where } from "firebase/firestore";
import { db } from "../firebase/index.js";


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
