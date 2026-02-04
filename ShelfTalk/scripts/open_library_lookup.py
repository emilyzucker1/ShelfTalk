import json
import sys
from urllib.parse import urlencode
from urllib.request import urlopen


BASE_URL = "https://openlibrary.org/search.json"
EDITION_URL_TEMPLATE = "https://openlibrary.org/books/{edition_key}.json"


def fetch_json(url: str) -> dict:
    """Fetch JSON from a URL and return it as a Python dict."""
    with urlopen(url) as response:
        return json.load(response)


def build_search_url(query: str, mode: str) -> str:
    """Build a search URL for title, author, or ISBN."""
    if mode == "title":
        params = {"title": query}
    elif mode == "author":
        params = {"author": query}
    elif mode == "isbn":
        params = {"isbn": query}
    else:
        raise ValueError(f"Unsupported mode: {mode}")

    return f"{BASE_URL}?{urlencode(params)}"


def print_results(data: dict, limit: int = 5) -> None:
    """Print a small, readable subset of results."""
    docs = data.get("docs", [])
    if not docs:
        print("No results found.")
        return

    for i, doc in enumerate(docs[:limit], start=1):
        title = doc.get("title", "Unknown title")
        authors = ", ".join(doc.get("author_name", [])) or "Unknown author"
        year = doc.get("first_publish_year", "Unknown year")
        isbn_list = doc.get("isbn", [])
        edition_keys = doc.get("edition_key", [])
        cover_id = doc.get("cover_i")

        isbn = isbn_list[0] if isbn_list else None
        if isbn is None and edition_keys:
            edition_url = EDITION_URL_TEMPLATE.format(edition_key=edition_keys[0])
            edition_data = fetch_json(edition_url)
            isbn_13 = edition_data.get("isbn_13", [])
            isbn_10 = edition_data.get("isbn_10", [])
            if isbn_13:
                isbn = isbn_13[0]
            elif isbn_10:
                isbn = isbn_10[0]

        if cover_id:
            cover_url = f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg"
        elif isbn:
            cover_url = f"https://covers.openlibrary.org/b/isbn/{isbn}-M.jpg"
        else:
            cover_url = "No cover available"

        print(f"{i}. {title}")
        print(f"   Author(s): {authors}")
        print(f"   First published: {year}")
        print(f"   ISBN (example): {isbn or 'Unknown ISBN'}")
        print(f"   Cover: {cover_url}")


def main() -> None:
    if len(sys.argv) < 3:
        print("Usage: python open_library_lookup.py <mode> <query>")
        print("Modes: title | author | isbn")
        sys.exit(1)

    mode = sys.argv[1].lower().strip()
    query = " ".join(sys.argv[2:]).strip()

    url = build_search_url(query, mode)
    data = fetch_json(url)
    print_results(data)


if __name__ == "__main__":
    main()
