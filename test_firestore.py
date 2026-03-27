import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

def encode_book_id(key : str) -> str:
    return key.replace("/", "_").strip("_")

def save_book(book: dict) -> None:
    book_id = encode_book_id(book["id"])
    db.collection("books").document(book_id).set(book, merge=True)
    [print(f"Saved book: {book['title']} (ID: {book_id})")]

def get_book(book_id: str):
    doc_ref = db.collection("books").document(book_id)
    doc = doc_ref.get()
    if doc.exists:
        return True
    else:
        print(f"No book found with ID: {book_id}")
        return False