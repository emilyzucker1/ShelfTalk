export async function searchOpenLibrary(query: string, limit: number = 10): Promise<any> {
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
    fields: "key,title,author_name,cover_i,first_publish_year",
  });

  const response = await fetch(`https://openlibrary.org/search.json?${params}`);

  if (!response.ok) throw new Error(`OpenLibrary error: ${response.status}`);

  return response.json();
}

export type Book = {
  id: string;
  title: string;
  source: string;
  authors: string[];
  coverUrl?: string;
  firstPublishYear?: number;
};

export function normalizeDoc(doc: any): Book | null {
  const workKey = doc?.key;
  if (typeof workKey !== "string" || !workKey.startsWith("/works/")) return null;

  const authors = Array.isArray(doc.author_name) && doc.author_name.length > 0
    ? doc.author_name
    : ["Unknown author"];

  const book: Book = {
    id: workKey,
    title: doc.title || "Untitled",
    source: "openlibrary",
    authors,
  };

  if (typeof doc.cover_i === "number")
    book.coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;

  if (typeof doc.first_publish_year === "number")
    book.firstPublishYear = doc.first_publish_year;

  return book;
}