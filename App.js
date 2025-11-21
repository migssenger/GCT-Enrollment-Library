import React, { useState } from "react";
import "./App.css";

// Components and Pages in alphabetical order
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Enroll from "./pages/Enroll";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Visit from "./pages/Visit";

function App() {
  const [mode, setMode] = useState("signup"); // current page/mode
  const [user, setUser] = useState(null); // logged-in user
  const [enrolled, setEnrolled] = useState(false); // enrollment status
  const [profilePic, setProfilePic] = useState(null); // profile picture URL

  // Show Navbar only when not on login or signup AND not admin
  const showNavbar = mode !== "login" && mode !== "signup" && user?.role !== 'admin';

  return (
    <>
      {showNavbar && (
        <Navbar setMode={setMode} user={user} setUser={setUser} />
      )}

      <div className={`container ${mode === 'admin' ? 'admin-container' : ''}`}>
        {mode === "about" && <About />}
        {mode === "admin" && <AdminDashboard />}
        {mode === "contact" && <Contact />}
        {mode === "dashboard" && (
          <Dashboard
            setMode={setMode}
            user={{ ...user, profilePic }}
            enrolled={enrolled}
          />
        )}
        {mode === "enroll" && (
          <Enroll
            user={user}
            setMode={setMode}
            setEnrolled={setEnrolled}
            setProfilePic={setProfilePic}
          />
        )}
        {mode === "login" && (
          <Login
            setMode={setMode}
            setUser={setUser}
            setEnrolled={setEnrolled}
            setProfilePic={setProfilePic}
          />
        )}
        {mode === "signup" && <Signup setMode={setMode} />}
        {mode === "visit" && <Visit />}
      </div>
    </>
  );
}

export default App;
