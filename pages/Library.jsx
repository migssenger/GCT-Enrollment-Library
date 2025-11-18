import React, { useState } from "react";
import axios from "axios";

function Library({ user }) {
  const [bookTitle, setBookTitle] = useState("");

  const borrowBook = async () => {
    if (!bookTitle) return alert("Enter book title first");
    try {
      await axios.post("/borrow", { email: user.email, bookTitle });
      alert("Book borrowed!");
    } catch {
      alert("Borrow failed.");
    }
  };

  const returnBook = async () => {
    if (!bookTitle) return alert("Enter book title first");
    try {
      await axios.post("/return", { email: user.email, bookTitle });
      alert("Book returned!");
    } catch {
      alert("Return failed.");
    }
  };

  const viewBooks = async () => {
    try {
      const res = await axios.get(`/mybooks/${user.email}`);
      alert(JSON.stringify(res.data, null, 2));
    } catch {
      alert("Failed to load books");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Library System</h2>
        <input
          placeholder="Book Title"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
        />
        <button onClick={borrowBook}>Borrow Book</button>
        <button onClick={returnBook}>Return Book</button>
        <button onClick={viewBooks}>View My Books</button>
      </div>
    </div>
  );
}

export default Library;
