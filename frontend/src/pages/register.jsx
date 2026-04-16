import React, { useState } from "react";
import api from "../api";

export default function Register() {
    const [form, setForm] = useState({ email: '', password: '', notify_new_books: false });
    const [message, setMessage] = useState('');

    const handleChange = e => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm({ ...form, [e.target.name]: value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/register', form);
            setMessage('Registration successful! You can now log in.');
            setForm({ email: '', password: '', notify_new_books: false });
        } catch (err) {
            setMessage(err.response?.data?.detail || 'Registration failed. Please try again.');
        }
    };
    return (
        <div style={{ padding: "2rem", maxWidth: "100%", margin: "0 auto" }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="email"
                    value={form.email}
                    placeholder="Email"
                    onChange={handleChange}
                    required
                    style={{ display: "block", width: "10%", marginBottom: 12 }}
                />
                <input
                    name="password"
                    type="password"
                    value={form.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    style={{ display: "block", width: "10%", marginBottom: 12 }}
                />
                <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, cursor: "pointer" }}>
                    <input
                        type="checkbox"
                        name="notify_new_books"
                        checked={form.notify_new_books}
                        onChange={handleChange}
                    />
                    Notify me when new books are added
                </label>
                <button type="submit" style={{ width: "10%" }}>Register</button>
            </form>
            {message && <div style={{ marginTop: 16 }}>{message}</div>}
        </div>
    );
}