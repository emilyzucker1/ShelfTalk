import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/index.js";
import {userID} from "../firebase"


export async function createUserProfile (user) {
    try {
        await setDoc(doc(db, "users", user.userID), {
            email: user.email,
            username: user.username,
            bio: "",
            photoURL: "",
            createdAt: serverTimestamp(),
        });
        return user.userID;
    } catch {
        console.log("Error sending data");
        return null;
    }
};

export async function getUserProfile(userID) {
  try {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {id: docSnap.id, ...docSnap.data() };
    }
    else {
      return null;
    }
  } catch (e) {
    console.log("Error fetching data:", e);
  }
}

export const updateUserProfile = async (userID, updates) => {
  try {
    await updateDoc(doc(db, "users", userID), updates);
  }
  catch (e) {
    console.log("Error updating data:", e);
  }
};