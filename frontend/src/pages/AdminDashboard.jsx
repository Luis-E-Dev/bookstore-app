import { useState, useEffect } from "react";
import api from "../api";

const emptyForm = { title: "", author: "", desc: "", category: "", image_url: ""};

export default function AdminDashboard() {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    async function fetchBooks() {
        try {
            const res = await api.get("/books/");
            setBooks(res.data);
        } catch (err) {
            setMessage("Failed to load books.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleEdit(book) {
        setEditingId(book.id);
        setForm({
            title: book.title,
            author: book.author,
            desc: book.desc || "",
            category: book.category || "",
        });
        setMessage("");
    }

    function handleCancel() {
        setEditingId(null);
        setForm(emptyForm);
        setMessage("");
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");
        try {
            if (editingId) {
                await api.put(`/books/${editingId}`, form);
                setMessage("Book updated successfully.");
            } else {
                await api.post("/books/", form);
                setMessage("Book added successfully.");
            }
            setForm(emptyForm);
            setEditingId(null);
            fetchBooks();
        } catch (err) {
            setMessage(err.response?.data?.detail || "Operation failed.");
        }
    }

    async function handleDelete(bookId) {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            await api.delete(`/books/${bookId}`);
            setMessage("Book deleted.");
            fetchBooks();
        } catch (err) {
            setMessage(err.response?.data?.detail || "Delete failed.");
        }
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Admin Dashboard</h2>

            {message && (
                <p style={{ color: message.toLowerCase().includes("fail") ? "red" : "green" }}>
                    {message}
                </p>
            )}

            <h3>{editingId ? "Edit Book" : "Add New Book"}</h3>
            <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
                <input
                    name="title"
                    value={form.title}
                    placeholder="Title"
                    onChange={handleChange}
                    required
                    style={{ display: "block", marginBottom: 8, width: 300 }}
                />
                <input
                    name="author"
                    value={form.author}
                    placeholder="Author"
                    onChange={handleChange}
                    required
                    style={{ display: "block", marginBottom: 8, width: 300 }}
                />
                <input
                    name="category"
                    value={form.category}
                    placeholder="Category"
                    onChange={handleChange}
                    style={{ display: "block", marginBottom: 8, width: 300 }}
                />
                <textarea
                    name="desc"
                    value={form.desc}
                    placeholder="Description"
                    onChange={handleChange}
                    rows={3}
                    style={{ display: "block", marginBottom: 8, width: 300 }}
                />
                <input
                    name="image_url"
                    value={form.image_url}
                    placeholder="Image URL (optional)"
                    onChange={handleChange}
                    style={{ display: "block", marginBottom: 8, width: 300 }}
                />
                <button type="submit" style={{ marginRight: 8 }}>
                    {editingId ? "Save Changes" : "Add Book"}
                </button>
                {editingId && (
                    <button type="button" onClick={handleCancel}>
                        Cancel
                    </button>
                )}
            </form>

            <h3>All Books ({books.length})</h3>
            {books.length === 0 ? (
                <p>No books yet.</p>
            ) : (
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr style={{ background: "#f0f0f0" }}>
                            <th style={th}>ID</th>
                            <th style={th}>Title</th>
                            <th style={th}>Author</th>
                            <th style={th}>Category</th>
                            <th style={th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr
                                key={book.id}
                                style={{ background: editingId === book.id ? "#fffbe6" : "white" }}
                            >
                                <td style={td}>{book.id}</td>
                                <td style={td}>{book.title}</td>
                                <td style={td}>{book.author}</td>
                                <td style={td}>{book.category || "—"}</td>
                                <td style={td}>
                                    <button onClick={() => handleEdit(book)} style={{ marginRight: 8 }}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(book.id)} style={{ color: "red" }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

const th = { border: "1px solid #ccc", padding: "8px 12px", textAlign: "left" };
const td = { border: "1px solid #ccc", padding: "8px 12px" };