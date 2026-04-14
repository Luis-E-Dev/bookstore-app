import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage('');
        try {
            const formData = new URLSearchParams();
            formData.append('username', form.email);
            formData.append('password', form.password);
            const response = await axios.post('http://localhost:8000/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const token = response.data.access_token;
            const payload = JSON.parse(atob(token.split('.')[1]));
            login(token);
            setForm({ email: '', password: '' });
            if (payload.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
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