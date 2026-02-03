import React, { useState } from "react";
import axios from "axios";

export default function Register() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage('');
        try {
            await axios.post('http://localhost:8000/signup', form);
            setMessage('Registration successful! You can now log in.');
            setForm({ email: '', password: '' });
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
                <button type="submit" style={{ width: "10%" }}>Register</button>
            </form>
            {message && <div style= {{ marginTop: 16 }}>{message}</div>}
        </div>
    );
}