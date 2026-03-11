import argparse

import firebase_admin
from firebase_admin import credentials, firestore

from open_library_lookup import normalize_doc, search_openlibrary

# HAVE TO: CONNECT TO SEARCH.
# Initializing Firestore.
def init_db(credential_path: str = "serviceAccountKey.json"):
    if not firebase_admin._apps:
        cred = credentials.Certificate(credential_path)
        firebase_admin.initialize_app(cred)
    return firestore.client()

# logs search event
def log_search(db, query: str, matched_count: int, user_id: str | None = None) -> None:
    payload = {
        "query": query,
        "matchedCount": matched_count,
        "createdAt": firestore.SERVER_TIMESTAMP,
    }
    if user_id:
        payload["userId"] = user_id
    db.collection("searches").add(payload)


def search_and_log(
    query: str,
    limit: int = 10,
    credential_path: str = "serviceAccountKey.json",
    user_id: str | None = None,
) -> list[dict]:
    db = init_db(credential_path)
    data = search_openlibrary(query, limit=limit)

    books: list[dict] = []
    for doc in data.get("docs", []):
        book = normalize_doc(doc)
        if book:
            books.append(book)

    log_search(db, query=query, matched_count=len(books), user_id=user_id)
    ## CHANGE LATER TO BE THE ONE THAT WE WANT TO SHOW, NOT JUST THE FIRST ONE
    db.collection("books").add(books[0]);
    return books


def main() -> None:
    parser = argparse.ArgumentParser(description="Search OpenLibrary and log the search in Firestore.")
    parser.add_argument("query", help="Book search query")
    parser.add_argument("--limit", type=int, default=10, help="Maximum number of results")
    parser.add_argument(
        "--credential-path",
        default="serviceAccountKey.json",
        help="Path to Firebase service account JSON",
    )
    parser.add_argument("--user-id", default=None, help="Optional user id to attach to search log")
    args = parser.parse_args()

    books = search_and_log(
        query=args.query,
        limit=args.limit,
        credential_path=args.credential_path,
        user_id=args.user_id,
    )
    print(f"Logged search '{args.query}' with {len(books)} matches")


if __name__ == "__main__":
    main()