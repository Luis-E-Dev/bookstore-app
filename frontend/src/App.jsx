import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import PrivateRoute from "./components/PrivateRoute";
import BooksList from "./BookList";
import AdminDashboard from "./pages/AdminDashboard";

function App() {

    return (
        <div style={{ margin: '2rem' }}>
            <h1>Bookstore App</h1>
            <Router>
                <nav style={{ padding: '1rem' }}>
                    <Link to="/register" style={{ marginRight: '1rem' }}>Register</Link>
                    <Link to="/login" state={{ marginRight: '1rem' }}>Login</Link>
                    <Link to="https://luis-e-dev.github.io/bookstore-app/portfolio/index.html">Portfolio</Link>
                </nav>
                <Routes>
                    <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/books" element={<BooksList />} />
                    <Route path="/" element={<BooksList />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;