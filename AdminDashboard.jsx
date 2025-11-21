import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState("");

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

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
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
                <button onClick={() => handleApprove(e.email)}>Approve</button>{" "}
                <button onClick={() => handleReject(e.email)}>Reject</button>
              </td>
              <td>{e.rejectionReason || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;