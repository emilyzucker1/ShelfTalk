import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

export async function logSearch(
  query: string,
  matchedCount: number,
  userId?: string
): Promise<void> {
  const payload: any = {
    query,
    matchedCount,
    createdAt: serverTimestamp(),
  };

  if (userId) payload.userId = userId;

  await addDoc(collection(db, "searches"), payload);
}