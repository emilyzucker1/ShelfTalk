import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../app/firebase/index.js";
import { Book } from "../scripts/openlib_lookup";

async function resolveCurrentUserId() {
  if (auth.currentUser?.uid) {
    return auth.currentUser.uid;
  }

  const resolvedUser = await new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      unsubscribe();
      reject(new Error("User must be signed in before accessing shelves."));
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user?.uid) {
        return;
      }

      clearTimeout(timeoutId);
      unsubscribe();
      resolve(user);
    });
  });

  return resolvedUser.uid;
}

export async function getUserShelves() {
  const currentUserId = await resolveCurrentUserId();
  const shelvesRef = collection(db, "users", currentUserId, "shelves");
  const snapshot = await getDocs(shelvesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getUserShelfGroups() {
  const currentUserId = await resolveCurrentUserId();
  const shelvesRef = collection(db, "users", currentUserId, "shelves");
  const shelvesSnapshot = await getDocs(shelvesRef);

  return Promise.all(
    shelvesSnapshot.docs.map(async (shelfDoc) => {
      const shelfData = shelfDoc.data() as { name?: string };
      const booksRef = collection(db, "users", currentUserId, "shelves", shelfDoc.id, "books");
      const booksSnapshot = await getDocs(booksRef);

      return {
        id: shelfDoc.id,
        name: shelfData?.name ?? "Shelf",
        books: booksSnapshot.docs.map((bookDoc) => {
          const bookData = bookDoc.data() as { title?: string; coverUrl?: string | null };
          return {
            id: bookDoc.id,
            title: bookData?.title ?? "Untitled",
            coverUrl: bookData?.coverUrl ?? null,
          };
        }),
      };
    })
  );
}

export async function addShelf(name: string) {
  const currentUserId = await resolveCurrentUserId();
  const shelvesRef = collection(db, "users", currentUserId, "shelves");
  const docRef = await addDoc(shelvesRef, {
    name,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function addBookToShelf(shelfId: string, book: Book) {
  const currentUserId = await resolveCurrentUserId();
  const booksRef = collection(db, "users", currentUserId, "shelves", shelfId, "books");
  await addDoc(booksRef, {
    id: book.id,
    title: book.title,
    authors: book.authors,
    coverUrl: book.coverUrl ?? null,
    source: book.source,
    addedAt: serverTimestamp(),
  });
}