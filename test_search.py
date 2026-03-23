from ShelfTalk.scripts.open_library_lookup import search_openlibrary, normalize_doc
from test_firestore import save_book

query = "Jane Eyre"

data = search_openlibrary(query, limit=5)

books = []
for doc in data.get("docs", []):
    book = normalize_doc(doc)
    if book:
        books.append(book)

for i, book in enumerate(books):
    print(f"{i+1}. {book['title']} by {', '.join(book['authors'])}")

if books:
    save_book(books[0])