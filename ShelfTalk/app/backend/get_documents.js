import { collection, getDocs, query, where } from "firebase/firestore";
import { db, userID } from "../firebase/index.js";

// add public and private attributes
export async function getUserPosts(authorId) {
  try {
    const q = query(collection(db, "posts"), where("authorId", "==", userID));

    const querySnapshot = await getDocs(q);
  } catch {
    console.log("Error fetching data");
  }
  return querySnapshot;
}
