import React, { useState } from "react";
import axios from "axios";

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await axios.post('http://localhost:8000/login', form);
            setMessage('Login successful! Token: ' + response.data.access_token);
            setForm({ email: '', password: '' });
        } catch (err) {
            setMessage(err.response?.data?.detail || 'Login failed. Please try again.');
        }
    };
    return (
        <div style={{ padding: "2rem", maxWidth: "100%", margin: "0 auto" }}>
            <h2>Login</h2>
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
                <button type="submit" style={{ width: "10%" }}>Login</button>
            </form>
            {message && <div style= {{ marginTop: 16 }}>{message}</div>}
        </div>
    );
}