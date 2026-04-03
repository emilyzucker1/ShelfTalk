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

export async function getOwnPublicPosts(authorId) {
  try {
    const q = query(
      collection(db, "posts"),
      where("authorId", "==", authorId),
      where("isPublic", "==", true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.log("Error fetching own public posts:", e);
    return [];
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

export async function getFollowingPosts(followingIds) {
  if (!followingIds || followingIds.length === 0) return [];

  // Firestore "in" queries are limited to 30 values; chunk if needed
  const chunks = [];
  for (let i = 0; i < followingIds.length; i += 30) {
    chunks.push(followingIds.slice(i, i + 30));
  }

  try {
    const results = await Promise.all(
      chunks.map(chunk => {
        const q = query(
          collection(db, "posts"),
          where("authorId", "in", chunk),
          where("isPublic", "==", true)
        );
        return getDocs(q).then(snap =>
          snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        );
      })
    );
    return results.flat();
  } catch (e) {
    console.log("Error fetching following posts:", e);
    return [];
  }
}
