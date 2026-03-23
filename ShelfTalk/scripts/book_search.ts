// import { addDoc, collection, limit as firestoreLimit, getDocs, query, where } from "firebase/firestore";
// import { db } from '../firebase';
// import { logSearch } from "./book_log";
import { Book, normalizeDoc, searchOpenLibrary } from "./openlib_lookup";

export async function searchAndLog(
  queryStr: string,
  limit: number = 10,
  userId?: string
): Promise<Book[]> {

  //Check our Firestore first
  // const booksRef = collection(db, "books");
  // const localQuery = query(
  //   booksRef,
  //   where("title", ">=", queryStr),
  //   where("title", "<=", queryStr + "\uf8ff"),
  //   firestoreLimit(limit)
  // );
  // const snapshot = await getDocs(localQuery);
  // let books: Book[] = snapshot.docs.map(doc => doc.data() as Book);

  let books: Book[] = [];

  // Fall back to OpenLibrary if nothing found
  if (books.length === 0) {
    const data = await searchOpenLibrary(queryStr, limit);
    for (const doc of data.docs ?? []) {
      const book = normalizeDoc(doc);
      if (book) books.push(book);
    }
    // Cache results for next user
    // for (const book of books) {
    //   await addDoc(collection(db, "books"), book);
    // }
  }

  // await logSearch(queryStr, books.length, userId);
  return books;
}