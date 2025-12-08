import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

function Login({ setMode, setUser, setEnrolled }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/login`, form);

      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        
        // Redirect based on role
        if (res.data.user.role === 'admin') {
          setMode("admin");
        } else {
          setEnrolled(res.data.user.enrolled === 1);
          setMode("dashboard");
        }
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={login}>
        <input
          type="text"
          name="email"
          placeholder="Email (numbers only for admin)"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p
        onClick={() => setMode("signup")}
        style={{ cursor: "pointer", color: "blue" }}
      >
        No account? Sign up
      </p>
    </div>
  );
}

export default Login;
