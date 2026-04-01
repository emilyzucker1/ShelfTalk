import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db, userID } from "../app/firebase/index.js";
import { Book } from "../scripts/openlib_lookup";

export async function getUserShelves() {
  const shelvesRef = collection(db, "users", userID, "shelves");
  const snapshot = await getDocs(shelvesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addShelf(name: string) {
  const shelvesRef = collection(db, "users", userID, "shelves");
  const docRef = await addDoc(shelvesRef, {
    name,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function addBookToShelf(shelfId: string, book: Book) {
  const booksRef = collection(db, "users", userID, "shelves", shelfId, "books");
  await addDoc(booksRef, {
    id: book.id,
    title: book.title,
    authors: book.authors,
    coverUrl: book.coverUrl ?? null,
    source: book.source,
    addedAt: serverTimestamp(),
  });
}