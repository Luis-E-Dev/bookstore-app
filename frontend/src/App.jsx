import React, {  useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
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
            <Router>
                <nav style={{ padding: '1rem' }}>
                    <Link to="/register" style={{ marginRight: '1rem' }}>Register</Link>
                    <Link to="/login">Login</Link>
                </nav>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
    </div>
    );
}

export default App;