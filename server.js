// ✅ server.js — Enrollment + Library + Admin System
import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

const app = express();
const PORT = 4000;

// Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// Database
const db = new sqlite3.Database("ngilo.db", (err) => {
  err ? console.error("❌ DB connection failed:", err.message) 
      : console.log("✅ Connected to SQLite database");
});

// Create tables
db.serialize(() => {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      enrolled INTEGER DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS enrollment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT, surname TEXT, givenName TEXT, middleInitial TEXT,
      gender TEXT, dob TEXT, age INTEGER, civilStatus TEXT,
      course TEXT, semester TEXT, address TEXT, contact TEXT,
      father TEXT, mother TEXT, guardian TEXT, profilePic TEXT,
      status TEXT DEFAULT 'Pending', rejectionReason TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS library (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT, bookTitle TEXT, dateBorrowed TEXT, dateReturned TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE, password TEXT
    )`
  ];
  
  tables.forEach(sql => db.run(sql));
});

// File upload
const upload = multer({ 
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => cb(null, "profilePic-" + Date.now() + path.extname(file.originalname))
  })
});

// Helper functions
const handleDBError = (res, err, successMsg = "Operation successful") => {
  if (err) {
    console.error("DB Error:", err.message);
    return res.status(500).json({ success: false, error: "Database operation failed" });
  }
  res.json({ success: true, message: successMsg });
};

const hashPassword = async (password) => await bcrypt.hash(password, 10);
const comparePassword = async (plainPassword, hashedPassword) => await bcrypt.compare(plainPassword, hashedPassword);

const authUser = (table, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: "Missing fields" });

  db.get(`SELECT * FROM ${table} WHERE email = ?`, [email], async (err, row) => {
    if (err || !row) return res.status(401).json({ success: false, error: "Invalid credentials" });
    
    const isMatch = await comparePassword(password, row.password);
    if (!isMatch) return res.status(401).json({ success: false, error: "Invalid credentials" });

    res.json({ success: true, [table === "admins" ? "admin" : "user"]: row });
  });
};

// Routes
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: "Missing fields" });

  try {
    const hashedPassword = await hashPassword(password);
    db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashedPassword], (err) => {
      if (err) return res.status(400).json({ success: false, error: "User already exists" });
      res.json({ success: true, message: "Signup successful" });
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error during signup" });
  }
});

app.post("/login", (req, res) => authUser("users", req, res));
app.post("/admin/login", (req, res) => authUser("admins", req, res));

app.post("/admin/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: "Missing fields" });

  try {
    const hashedPassword = await hashPassword(password);
    db.run(`INSERT INTO admins (email, password) VALUES (?, ?)`, [email, hashedPassword], (err) => {
      if (err) return res.status(400).json({ success: false, error: "Admin already exists" });
      res.json({ success: true, message: "Admin signup successful" });
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

app.post("/enroll", upload.single("profilePic"), (req, res) => {
  const profilePicPath = req.file ? `/uploads/${req.file.filename}` : null;
  const fields = [
    req.body.email, req.body.surname, req.body.givenName, req.body.middleInitial,
    req.body.gender, req.body.dob, req.body.age, req.body.civilStatus, req.body.course,
    req.body.semester, req.body.address, req.body.contact, req.body.father,
    req.body.mother, req.body.guardian, profilePicPath
  ];

  db.run(`INSERT INTO enrollment (email, surname, givenName, middleInitial, gender, 
          dob, age, civilStatus, course, semester, address, contact, father, mother, 
          guardian, profilePic, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
          fields, function(err) {
    if (err) return handleDBError(res, err, "Enrollment failed");
    
    db.run(`UPDATE users SET enrolled = 1 WHERE email = ?`, [req.body.email]);
    res.json({ success: true, profilePic: profilePicPath });
  });
});

app.get("/enrollment/:email", (req, res) => {
  db.get(`SELECT * FROM enrollment WHERE email = ?`, [req.params.email], (err, row) => {
    err ? res.status(500).json({ success: false, error: "Error fetching enrollment" }) 
        : res.json(row || {});
  });
});

// Library routes
app.post("/borrow", (req, res) => {
  const { email, bookTitle } = req.body;
  const today = new Date().toISOString().split("T")[0];
  db.run(`INSERT INTO library (email, bookTitle, dateBorrowed) VALUES (?,?,?)`, 
         [email, bookTitle, today], (err) => handleDBError(res, err, "Book borrowed"));
});

app.post("/return", (req, res) => {
  const { email, bookTitle } = req.body;
  const today = new Date().toISOString().split("T")[0];
  db.run(`UPDATE library SET dateReturned = ? WHERE email = ? AND bookTitle = ? AND dateReturned IS NULL`,
         [today, email, bookTitle], function(err) {
    if (err) return handleDBError(res, err, "Return failed");
    this.changes === 0 ? res.status(400).json({ success: false, error: "Book not found" }) 
                       : res.json({ success: true });
  });
});

app.get("/mybooks/:email", (req, res) => {
  db.all(`SELECT * FROM library WHERE email = ?`, [req.params.email], (err, rows) => {
    err ? res.status(500).json({ success: false, error: "Error fetching books" }) 
        : res.json(rows || []);
  });
});

// Admin routes
app.get("/admin/enrollments", (req, res) => {
  db.all(`SELECT * FROM enrollment`, [], (err, rows) => {
    err ? res.status(500).json({ success: false, error: "Error fetching enrollments" }) 
        : res.json(rows || []);
  });
});

app.post("/admin/approve", (req, res) => {
  db.run(`UPDATE enrollment SET status = 'Approved', rejectionReason = NULL WHERE email = ?`,
         [req.body.email], (err) => handleDBError(res, err, "Enrollment approved"));
});

app.post("/admin/reject", (req, res) => {
  db.run(`UPDATE enrollment SET status = 'Rejected', rejectionReason = ? WHERE email = ?`,
         [req.body.reason, req.body.email], (err) => handleDBError(res, err, "Enrollment rejected"));
});

app.get("/", (req, res) => res.send("✅ Enrollment & Admin System Server is Running"));
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));