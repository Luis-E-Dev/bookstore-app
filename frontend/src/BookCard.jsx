import React from "react";

const BookCard = ({ book }) => {
    return (
        <li className="book-card">
            {book.image_url && (
                <img
                    src={book.image_url}
                    alt={book.title}
                    style={{ width: 80, height: 110, objectFit: "cover"}}
                />
            )}
            <h2>{book.title}</h2>
            <p className="book-meta">
                By {book.author} {book.added_by ? `- Added By ${book.added_by}` : ""}
            </p>
            <p>{book.desc}</p>
            <button onClick={() => console.log(book.id)}>Read More</button>
        </li>
    );
};

export default BookCard;