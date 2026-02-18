import { getUserPosts } from "./backend/get_documents.js";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, userID } from "../firebase/index.js";

export default function PostsScreen() {
  return (
    posts = getUserPosts()
    posts.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
    });
    )
}
