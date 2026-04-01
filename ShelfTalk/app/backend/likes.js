import { doc, getDoc, updateDoc, deleteDoc, increment, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/index.js";

//posts can either be liked or unliked (toggled on or toggled off)
export async function toggleLike(postID, userID) {
    try {
        const likeRef = doc(db, "posts", postID, "likes", userID);
        const postRef = doc(db, "posts", postID);

        const likeSnap = await getDoc(likeRef);

        //if the like already exists, then remove it and decrease the likeCount on the post by 1
        if (likeSnap.exists()) {
            await deleteDoc(likeRef);
            await updateDoc(postRef, { likeCount: increment(-1) });
            return false;
        }
        //if the like doesn't exist, then add it and increase the likeCount on the post by 1
        else {
            await setDoc(likeRef, { userId: userID, createdAt: serverTimestamp() });
            await updateDoc(postRef, { likeCount: increment(1) });
            return true;
        }
    } catch (error) {
        console.error("Error liking post:", error);
        throw error;
    }
}