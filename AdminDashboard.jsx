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
                <div className="modal-panel">
                  <button className="modal-close" onClick={closeStudentDetails} aria-label="Close">×</button>
                  
                  <div className="resume-container">
                    {/* LEFT / HEADER SECTION */}
                    <div className="resume-left">
                      {selectedStudent.profilePic ? (
                        <img
                          className="profile-pic"
                          src={
                            selectedStudent.profilePic.startsWith("http")
                              ? selectedStudent.profilePic
                              : `http://localhost:4000${selectedStudent.profilePic}`
                          }
                          alt="profile"
                        />
                      ) : (
                        <div className="profile-placeholder">
                          No Photo
                        </div>
                      )}
                      <h3 className="resume-name">{selectedStudent.givenName} {selectedStudent.surname}</h3>
                      <p className="resume-contact">Email: {selectedStudent.email}</p>
                      <p className="resume-contact">Contact: {selectedStudent.contact || 'N/A'}</p>
                      
                      <div className="student-info" style={{ marginTop: '15px' }}>
                        <h4 className="section-title">Enrollment Status</h4>
                        <ul className="details-list">
                          <li><b>Status:</b> {selectedStudent.status}</li>
                          {selectedStudent.rejectionReason && <li><b>Reason:</b> {selectedStudent.rejectionReason}</li>}
                        </ul>
                      </div>
                    </div>
                    
                    {/* RIGHT / DETAILS SECTION */}
                    <div className="resume-right">
                      <h4 className="section-title">Academic Details</h4>
                      <div className="details-grid student-info">
                        <div className="detail-item"><div className="detail-label">Course:</div><div className="detail-value">{selectedStudent.course}</div></div>
                        <div className="detail-item"><div className="detail-label">Year/Sem:</div><div className="detail-value">{selectedStudent.yearLevel} / {selectedStudent.semester}</div></div>
                      </div>

                      <h4 className="section-title">Personal Details</h4>
                      <div className="details-grid student-info">
                        <div className="detail-item"><div className="detail-label">Gender:</div><div className="detail-value">{selectedStudent.gender}</div></div>
                        <div className="detail-item"><div className="detail-label">DOB:</div><div className="detail-value">{selectedStudent.dob}</div></div>
                        <div className="detail-item"><div className="detail-label">Age:</div><div className="detail-value">{selectedStudent.age}</div></div>
                        <div className="detail-item"><div className="detail-label">Civil Status:</div><div className="detail-value">{selectedStudent.civilStatus}</div></div>
                        <div className="detail-item"><div className="detail-label">Nationality:</div><div className="detail-value">{selectedStudent.nationality}</div></div>
                        <div className="detail-item" style={{ gridColumn: '1 / 3' }}><div className="detail-label">Address:</div><div className="detail-value">{selectedStudent.address}</div></div>
                      </div>

                      <h4 className="section-title">Parent/Guardian Details</h4>
                      <div className="details-grid student-info">
                        <div className="detail-item"><div className="detail-label">Father:</div><div className="detail-value">{selectedStudent.father}</div></div>
                        <div className="detail-item"><div className="detail-label">Father Occ.:</div><div className="detail-value">{selectedStudent.fatherOccupation}</div></div>
                        <div className="detail-item"><div className="detail-label">Mother:</div><div className="detail-value">{selectedStudent.mother}</div></div>
                        <div className="detail-item"><div className="detail-label">Mother Occ.:</div><div className="detail-value">{selectedStudent.motherOccupation}</div></div>
                        <div className="detail-item"><div className="detail-label">Guardian:</div><div className="detail-value">{selectedStudent.guardian || 'N/A'}</div></div>
                      </div>

                      <h4 className="section-title">Documents</h4>
                      <div className="details-grid student-info">
                        {selectedStudent.birthCertificate && (
                            <div className="detail-item">
                                <div className="detail-label">Birth Cert:</div>
                                <div className="detail-value">
                                    <a href={`http://localhost:4000${selectedStudent.birthCertificate}`} target="_blank" rel="noopener noreferrer">View File</a>
                                </div>
                            </div>
                        )}
                        {selectedStudent.goodMoral && (
                            <div className="detail-item">
                                <div className="detail-label">Good Moral:</div>
                                <div className="detail-value">
                                    <a href={`http://localhost:4000${selectedStudent.goodMoral}`} target="_blank" rel="noopener noreferrer">View File</a>
                                </div>
                            </div>
                        )}
                      </div>

                      <div className="modal-footer">
                        {selectedStudent.status === 'Pending' && (
                            <>
                                <button className="btn-accept" onClick={() => handleApprove(selectedStudent.email)}>Approve</button>
                                <button className="btn-reject" onClick={() => handleReject(selectedStudent.email)}>Reject</button>
                            </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
    </div>
  );
}

export default AdminDashboard;
