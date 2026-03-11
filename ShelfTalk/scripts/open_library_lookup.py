import requests
# search for books in OpenLibraryAPI
def search_openlibrary(query: str, limit: int = 10) -> dict:
    url = "https://openlibrary.org/search.json"
    params = {
        "q": query,
        "limit": limit,
        "fields": "key,title,author_name,cover_i,first_publish_year",
    }
    r = requests.get(url, params=params, timeout=10)
    r.raise_for_status()
    return r.json()

def normalize_doc(doc: dict) -> dict | None:
    work_key = doc.get("key")
    if not isinstance(work_key, str) or not work_key.startswith("/works/"):
        return None

    title = doc.get("title") or "Untitled"

    authors = doc.get("author_name")
    if not isinstance(authors, list) or len(authors) == 0:
        authors = ["Unknown author"]

    book = {
        "id": work_key,
        "title": title,
        "source": "openlibrary",
        "authors": authors,
    }

    cover_i = doc.get("cover_i")
    if isinstance(cover_i, int):
        book["coverUrl"] = f"https://covers.openlibrary.org/b/id/{cover_i}-M.jpg"

    year = doc.get("first_publish_year")
    if isinstance(year, int):
        book["firstPublishYear"] = year

    return book

#gonna return a book object, now we can save it and show to user