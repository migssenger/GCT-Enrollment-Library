import React from "react";

function Navbar({ setMode, user, setUser }) {
  const handleLogout = () => {
    setUser(null);
    setMode("login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h3 onClick={() => setMode("dashboard")} className="nav-logo">
          GCT Online Enrolment
        </h3>
      </div>

      <div className="nav-right">
        {user && (
          <>
            <button onClick={() => setMode("dashboard")}>Dashboard</button>
            <button onClick={() => setMode("enroll")}>Enroll</button>
            <button onClick={() => setMode("library")}>Library</button>
          </>
        )}
        <button onClick={() => setMode("about")}>About</button>
        <button onClick={() => setMode("contact")}>Contact Us</button>
        <button onClick={() => setMode("visit")}>Visit Us</button>
        {user && <button onClick={handleLogout}>Logout</button>}
      </div>
    </nav>
  );
}

export default Navbar;
