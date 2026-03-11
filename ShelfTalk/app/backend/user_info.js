import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/index.js";


export async function createUserProfile (authorID, email, username) {
    try {
        const docRef = await addDoc(collection(db, "posts"), {
            email: email,
            username: username,
            bio: "",
            photoURL: "",
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch {
        console.log("Error sending data");
    }
    return null;
};

export async function getUserProfile(authorID) {
  try {
    const q = query(collection(db, "users"), where("authorId", "==", authorId));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    console.log("Error fetching data:", e);
  }
}

export const updateUserProfile = async (uid, updates) => {
  await updateDoc(doc(db, "users", uid), updates);
};