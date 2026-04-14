import React, { useEffect, useState} from "react";
import BookCard from "./BookCard";

const API_URL = "http://localhost:8000/books/";

const BooksList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(API_URL)
           .then((res) =>{
            if(!res.ok) {
                throw new Error("Failed to fetch the list of books");
            }
            return res.json();
           })
           .then((data) => {
            setBooks(data);
            setLoading(false);
           })
           .catch((err) => {
            setError(err.message);
            setLoading(false);
           });
    }, []);

    if (loading) return <p>Loading books...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="books-page">
            <h1>Books</h1>

            <ul className="books-list">
                {books.map((book) => (
                    <BookCard key={book.id} book={book}>
                        <h2>{book.title}</h2>
                        <p className="book-meta">
                            By {book.author} - Added By {book.added_by}
                        </p>
                        <p>{book.description}</p>

                        <button onClick={() => console.log(book.id)}>
                            Read More
                        </button>
                    </BookCard>
                ))}
            </ul>
        </div>
    );
};



export default BooksList