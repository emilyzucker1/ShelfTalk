import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/index.js";


export async function getUserPosts(authorId) {
  try {
    // Profile page should only return posts owned by the current user.
    const q = query(collection(db, "posts"), where("authorId", "==", authorId));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    console.log("Error fetching data:", e);
  }
}

export async function getPublicPosts() {
  try {
    const q = query(collection(db, "posts"), where("isPublic", "==", true));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    console.log("Error fetching public posts:", e);
  }
}
