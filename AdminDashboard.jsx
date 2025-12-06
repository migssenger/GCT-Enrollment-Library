import React, { useEffect, useState } from "react";

function AdminDashboard({ setMode, setUser }) {
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchEnrollments = async () => {
    try {
      const res = await fetch("http://localhost:4000/admin/enrollments");
      const data = await res.json();
      setEnrollments(data);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      setError("Failed to load enrollments");
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleApprove = async (email) => {
    try {
      await fetch("http://localhost:4000/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      fetchEnrollments();
    } catch (err) {
      alert("Approval failed");
    }
  };

  const handleReject = async (email) => {
    const reason = prompt("Enter reason for rejection:");
    if (!reason) return;
    try {
      await fetch("http://localhost:4000/admin/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reason }),
      });
      fetchEnrollments();
    } catch (err) {
      alert("Rejection failed");
    }
  };

  const openStudentDetails = (student) => {
    setSelectedStudent(student);
  };

  const closeStudentDetails = () => {
    setSelectedStudent(null);
  };

  const handleLogout = () => {
    // Ask for confirmation, then clear local user state and navigate to login.
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;
    try {
      setUser(null);
    } catch (err) {
      // if setUser isn't provided, ignore
    }
    if (setMode) setMode("login");
  };

  return (
    <div className="admin-dashboard">
      <button
        onClick={handleLogout}
        aria-label="Logout"
        style={{ position: "fixed", top: 12, right: 12, zIndex: 1000 }}
      >
        Logout
      </button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
      </div>
      {error && <p className="error">{error}</p>}

      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Course</th>
            <th>Status</th>
            <th>Action</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((e) => (
            <tr key={e.id}>
              <td>{e.email}</td>
              <td>
                {e.surname}, {e.givenName}
              </td>
              <td>{e.course}</td>
              <td>{e.status}</td>
              <td>
                <button className="btn-accept" onClick={() => handleApprove(e.email)} title="Accept student">Accept</button>{" "}
                <button className="btn-reject" onClick={() => handleReject(e.email)} title="Reject student">Reject</button>{" "}
                <button className="btn-view" onClick={() => openStudentDetails(e)} title="View details">View</button>
              </td>
              <td>{e.rejectionReason || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
          {/* Student details modal */}
          {selectedStudent && (
            <>
              <div className="modal-backdrop" onClick={closeStudentDetails} />
              <div className="modal" role="dialog" aria-modal="true">
                <button className="modal-close" onClick={closeStudentDetails} aria-label="Close">×</button>
                {selectedStudent.profilePic && (
                  <img
                    className="profile-pic"
                    src={
                      // if profilePic is stored as path on server, ensure full URL if needed
                      selectedStudent.profilePic.startsWith("http")
                        ? selectedStudent.profilePic
                        : `http://localhost:4000${selectedStudent.profilePic}`
                    }
                    alt="profile"
                  />
                )}
                <h3 style={{ textAlign: "center" }}>{selectedStudent.givenName} {selectedStudent.surname}</h3>
                <ul className="details-list">
                  <li><b>Email:</b> {selectedStudent.email}</li>
                  <li><b>Course:</b> {selectedStudent.course}</li>
                  <li><b>Status:</b> {selectedStudent.status}</li>
                  <li><b>Rejection reason:</b> {selectedStudent.rejectionReason || '-'}</li>
                </ul>

                <h4>Other details</h4>
                <ul className="details-list">
                  {Object.entries(selectedStudent).map(([k, v]) => {
                    if (["email", "course", "status", "rejectionReason", "givenName", "surname", "profilePic", "id"].includes(k)) return null;
                    return (
                      <li key={k}><b>{k}:</b> {String(v)}</li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}
    </div>
  );
}

export default AdminDashboard;