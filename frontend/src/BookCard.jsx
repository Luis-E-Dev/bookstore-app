import React from "react";

const BookCard = ({ book }) => {
    return (
        <div className="book-card">
            <div className="book-cover-wrapper">
                {book.image_url ? (
                    <img
                        src={book.image_url}
                        alt={book.title}
                        className="book-cover"
                    />
                ) : (
                    <div className="book-cover-placeholder">📚</div>
                )}
            </div>
            <div className="book-info">
                <h2 className="book-title">{book.title}</h2>
                <p className="book-author">By {book.author}</p>
                {book.category && (
                    <span className="book-category">{book.category}</span>
                )}
                {book.desc && (
                    <p className="book-desc">{book.desc}</p>
                )}
                {book.read_more_url && (
                    <a
                        href={book.read_more_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="read-more-btn"
                    >
                        Read More
                    </a>
                )}
            </div>
        </div>
    );
};

export default BookCard;