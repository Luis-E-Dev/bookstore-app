import React, {  use, useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        // Fetch books from backend
        axios.get("https://localhost:8000/books/")
        .then((res) => setBooks(res.data))
        .catch((err) => console.error(err));
    }, []);

    return (
        <div style={{ margin: '2rem' }}>
            <h1>Bookstore Inventory</h1>
            <ul>
                {books.map(book => 
                <li key={book.id}>
                    <strong>{book.title}</strong> by {book.author}
                </li>
            )}
        </ul>
        {/* TODO: Add search, loging, book detail, admin controls */}
    </div>
    );
}

export default App;