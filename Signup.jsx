import React, { useState } from "react";
import axios from "axios";

function Signup({ setMode }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const signup = async () => {
    if (!form.email || !form.password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/signup", form);

      if (res.data.success) {
        alert("Signup successful!");
        setMode("login");
      } else {
        alert(res.data.error || "Signup failed.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Signup</h2>
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
      <button onClick={signup} disabled={loading}>
        {loading ? "Signing up..." : "Signup"}
      </button>
      <p
        onClick={() => setMode("login")}
        style={{ cursor: "pointer", color: "blue" }}
      >
        Already have an account? Login
      </p>
    </div>
  );
}

export default Signup;