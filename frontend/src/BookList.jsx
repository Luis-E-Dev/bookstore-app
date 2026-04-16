import React, { useEffect, useState} from "react";
import BookCard from "./BookCard";
import api from "./api";
import "./App.css"

const BooksList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const AUTO_PLAY_INTERVAL = 5000;

    const fetchBooks = (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        api.get("/books/")
            .then(res => {
                setBooks(res.data);
                setLoading(false);
                setError(null);
                if (isRefresh) {
                    setCurrentIndex(0);
                    setRefreshing(false);
                }
            })
            .catch(err => {
                setError("Failed to load books.");
                setLoading(false);
                setRefreshing(false);
            });
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        if (!isAutoPlay || books.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => 
                prev + 1 >= books.length ? 0 : prev + 1
            );
        }, AUTO_PLAY_INTERVAL);
        return () => clearInterval(interval);
    }, [isAutoPlay, books.length]);

    const next = () => setCurrentIndex(prev => 
            prev + 1 >= books.length ? 0 : prev + 1
        );

    const prev = () => setCurrentIndex(prev => 
            prev === 0 ? books.length - 1 : prev - 1
        );

    const goToSlide = (index) => setCurrentIndex(index);

    if (loading) return <p>Loading books...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
    if (books.length === 0) return <p>No books available yet.</p>

    return (
        <div className="books-page">
            <div className="carousel-header">
                <h1 className="books-header">Books</h1>
                <div className="carousel-controls">
                    <label className="auto-play-toggle">
                        <input 
                            type="checkbox" 
                            checked={isAutoPlay}
                            onChange={e => setIsAutoPlay(e.target.checked)}
                        />
                        <span>Auto-play</span>
                    </label>
                    <button
                        className="refresh-btn"
                        onClick={() => fetchBooks(true)}
                        disabled={refreshing}
                        aria-label="Refresh books"
                    >
                        {refreshing ? "Refreshing…" : "↻ Refresh"}
                    </button>
                </div>
            </div>

            <div className="carousel-wrapper">
                <button className="carousel-btn" onClick={prev} aria-label="Previous Book">‹</button>
                <div className="carousel-slides">
                        <BookCard
                            book={books[currentIndex]}
                        />
                </div>
                <button className="carousel-btn" onClick={next} aria-label="Next Book">›</button>
            </div>

            <div className="carousel-dots">
                {books.map((_, i) => (
                    <span 
                        key={i}
                        className={`dot ${i === currentIndex ? "active" : ""}`}
                        onClick={() => goToSlide(i)}
                        role="button"
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>

            <div className="carousel-counter">
                Book {currentIndex + 1} of {books.length}
            </div>
        </div>
    );
};


export default BooksList;