import React, { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Enroll from "./pages/Enroll";
import Library from "./pages/Library";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Visit from "./pages/Visit";

function App() {
  const [mode, setMode] = useState("signup"); // current page/mode
  const [user, setUser] = useState(null); // logged-in user
  const [enrolled, setEnrolled] = useState(false); // enrollment status
  const [profilePic, setProfilePic] = useState(null); // profile picture URL

  // Show Navbar only when not on login or signup
  const showNavbar = mode !== "login" && mode !== "signup";

  return (
    <>
      {showNavbar && (
        <Navbar setMode={setMode} user={user} setUser={setUser} />
      )}

      <div className="container">
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
        {mode === "library" && <Library user={user} />}
        {mode === "login" && (
          <Login
            setMode={setMode}
            setUser={setUser}
            setEnrolled={setEnrolled}
            setProfilePic={setProfilePic}
          />
        )}
        {mode === "signup" && <Signup setMode={setMode} />}
        {mode === "about" && <About />}
        {mode === "contact" && <Contact />}
        {mode === "visit" && <Visit />}
      </div>
    </>
  );
}

export default App;
