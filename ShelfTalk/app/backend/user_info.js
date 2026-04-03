import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/index.js";


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

export async function followUser(currentUid, targetUid) {
  await setDoc(doc(db, "users", currentUid, "following", targetUid), {
    followedAt: serverTimestamp(),
  });
}

export async function unfollowUser(currentUid, targetUid) {
  await deleteDoc(doc(db, "users", currentUid, "following", targetUid));
}

export async function getFollowingIds(currentUid) {
  const snap = await getDocs(collection(db, "users", currentUid, "following"));
  return snap.docs.map(d => d.id);
}