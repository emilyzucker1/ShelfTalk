import { addDoc, collection, limit as firestoreLimit, getDocs, query, where } from "firebase/firestore";
import { db } from '../app/firebase';
//import { logSearch } from "./book_log";
import { Book, normalizeDoc, searchOpenLibrary } from "./openlib_lookup";

export async function searchAndLog(
  queryStr: string,
  limit: number = 10,
  userId?: string
): Promise<Book[]> {
  let books: Book[] = [];

  try {
    // Check our Firestore cache first.
    const booksRef = collection(db, "books");
    const localQuery = query(
      booksRef,
      where("title", ">=", queryStr),
      where("title", "<=", queryStr + "\uf8ff"),
      firestoreLimit(limit)
    );
    const snapshot = await getDocs(localQuery);
    books = snapshot.docs.map(doc => doc.data() as Book);
  } catch (error) {
    console.log("Skipping Firestore book cache:", error);
  }

  console.log("Before open library if");
  // Fall back to OpenLibrary if nothing found
  if (books.length === 0) {
    console.log("On openlibrary");
    const data = await searchOpenLibrary(queryStr, limit);
    for (const doc of data.docs ?? []) {
      const book = normalizeDoc(doc);
      if (book) books.push(book);
    }

    console.log("after open library if");
    // Cache results for next user
    for (const book of books) {
      try {
        console.log("Cache");
        await addDoc(collection(db, "books"), book);
      } catch (error) {
        console.log("Skipping book cache write:", error);
      }
    }
  }

  return books;
}