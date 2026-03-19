import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/index.js";


export async function createUserProfile (authorId, email, username, password) {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            authorId: authorId,
            email: email,
            username: username,
            password: password,
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

export const updateUserProfile = async (authorId, updates) => {
  await updateDoc(doc(db, "users", authorId), updates);
};