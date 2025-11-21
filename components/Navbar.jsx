import React from "react";

function Navbar({ setMode, user, setUser }) {
  const handleLogout = () => {
    setUser(null);
    setMode("login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h3 onClick={() => setMode(user?.role === 'admin' ? "admin" : "dashboard")} className="nav-logo">
          GCT Online Enrolment
        </h3>
      </div>

      <div className="nav-right">
        {user && user.role === 'admin' && (
          <button onClick={() => setMode("admin")}>Admin Dashboard</button>
        )}
        {user && user.role === 'user' && (
          <>
            <button onClick={() => setMode("dashboard")}>Dashboard</button>
            <button onClick={() => setMode("enroll")}>Enroll</button>
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
