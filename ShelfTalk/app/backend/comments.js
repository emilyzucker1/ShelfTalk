import { doc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/index.js";

//create a new comment for a post 
export async function createComment(postID, text, authorID, authorName) {
    try {
        //make sure the comment isn't empty or just whitespace
        if (!text || !text.trim()) {
            throw new Error("Comment cannot be empty");
        }

        const commentRef = collection(db, "posts", postID, "comments");
        
        await addDoc(commentRef, { text: text, authorId: authorID, authorName: authorName ?? 'User', createdAt: serverTimestamp() });
    } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
    }
}

//get all comments for a post
export async function getComments(postID) {
    try {
        const commentsRef = collection(db, "posts", postID, "comments");
        const commentsSnapshot = await getDocs(commentsRef);
        return commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
}

//get one specific comment
export async function getComment(postID, commentID) {
    try {
        const commentRef = doc(db, "posts", postID, "comments", commentID);
        const commentSnapshot = await getDoc(commentRef);

        if (commentSnapshot.exists()) {
            return { id: commentSnapshot.id, ...commentSnapshot.data() };
        }
    } catch (error) {
        console.error("Error fetching comment:", error);
        throw error;
    }
}

//edit a comment (only if the user is the author of the comment)
export async function updateComment(commentID, postID, newText) {
    try {
        //make sure the edited comment isn't empty or just whitespace
        if (!newText || !newText.trim()) {
            throw new Error("Comment cannot be empty");
        }
        const commentRef = doc(db, "posts", postID, "comments", commentID);
        
        await updateDoc(commentRef, {text: newText, editedAt: serverTimestamp()});

    } catch (error) {
        console.error("Error updating comment:", error);
        throw error;
    }
}

//delete a comment (only if the user is the author of the comment)
export async function deleteComment(commentID, postID) {
    try {
        const commentRef = doc(db, "posts", postID, "comments", commentID);
        await deleteDoc(commentRef);
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
}