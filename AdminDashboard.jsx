import React, { useEffect, useState, useCallback } from "react";

function AdminDashboard({ setMode, setUser }) {
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

  // Wrap fetchEnrollments in useCallback
  const fetchEnrollments = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/admin/enrollments`);
      const data = await res.json();
      setEnrollments(data);
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      setError("Failed to load enrollments");
    }
  }, [API_URL]); // API_URL is the only dependency

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]); // Now this is safe

  const handleApprove = async (email) => {
  try {
    const response = await fetch(`${API_URL}/admin/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    
    console.log("Response status:", response.status);
    const result = await response.json();
    console.log("Response data:", result);
    
    if (result.success) {
      alert(`Enrollment approved! Student ID: ${result.studentId}`);
      fetchEnrollments();
    } else {
      alert(`Approval failed: ${result.error || "Unknown error"}`);
    }
  } catch (err) {
    console.error("Approval error:", err);
    alert("Approval failed - network error");
  }
};

  const handleReject = async (email) => {
    const reason = prompt("Enter reason for rejection:");
    if (!reason) return;
    try {
      await fetch(`${API_URL}/admin/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reason }),
      });
      fetchEnrollments(); // This will work because fetchEnrollments is stable
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
  const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;
    
    console.log("Logging out...");
    
    // Clear user from localStorage if you're using it
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Call setUser if provided
    if (setUser) {
      setUser(null);
      console.log("User state cleared");
    }
    
    // Call setMode if provided
    if (setMode) {
      setMode("login");
      console.log("Redirecting to login");
    } else {
      // If setMode isn't available, try to redirect manually
      window.location.href = "/";
    }
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
        <div style={{ fontSize: '14px', color: '#666' }}>
          Total: {enrollments.length} | 
          Approved: {enrollments.filter(e => e.status === 'Approved').length} | 
          Pending: {enrollments.filter(e => e.status === 'Pending').length}
        </div>
      </div>
      {error && <p className="error">{error}</p>}

      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse", marginTop: '20px' }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th>Student ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Course</th>
            <th>Status</th>
            <th>Actions</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((e) => (
            <tr key={e.id} style={{ 
              backgroundColor: e.status === 'Approved' ? '#f0fff0' : 
                              e.status === 'Rejected' ? '#fff0f0' : 'white',
              borderBottom: '1px solid #eee'
            }}>
              <td style={{ 
                fontWeight: e.student_id ? 'bold' : 'normal',
                color: e.student_id ? '#2e7d32' : '#666',
                fontFamily: "'Courier New', monospace",
                fontSize: '14px'
              }}>
                {e.student_id ? 
                  <span style={{
                    backgroundColor: '#e8f5e9',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid #c8e6c9'
                  }}>
                    {e.student_id}
                  </span>
                  : 
                  (e.status === 'Approved' ? 'Generating...' : '-')
                }
              </td>
              <td>{e.email}</td>
              <td>
                {e.surname}, {e.givenName} {e.middleInitial ? e.middleInitial + '.' : ''}
              </td>
              <td>{e.course}</td>
              <td>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  backgroundColor: 
                    e.status === 'Approved' ? '#4CAF50' :
                    e.status === 'Rejected' ? '#f44336' : '#ff9800',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {e.status}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {e.status === 'Pending' ? (
                    <>
                      <button 
                        className="btn-accept" 
                        onClick={() => handleApprove(e.email)} 
                        title="Accept student"
                        style={{
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn-reject" 
                        onClick={() => handleReject(e.email)} 
                        title="Reject student"
                        style={{
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span style={{ 
                      color: '#666', 
                      fontSize: '12px',
                      padding: '6px 0',
                      display: 'inline-block'
                    }}>
                      {e.status === 'Approved' ? '✓ Approved' : '✗ Rejected'}
                    </span>
                  )}
                  <button 
                    className="btn-view" 
                    onClick={() => openStudentDetails(e)} 
                    title="View details"
                    style={{
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    View
                  </button>
                </div>
              </td>
              <td style={{ maxWidth: '200px', fontSize: '12px' }}>
                {e.rejectionReason || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {enrollments.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#666',
          border: '1px dashed #ccc',
          marginTop: '20px',
          borderRadius: '8px'
        }}>
          No enrollments found. When students enroll, they will appear here.
        </div>
      )}

      {/* Student details modal */}
      {selectedStudent && (
        <>
          <div 
            className="modal-backdrop" 
            onClick={closeStudentDetails}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1000
            }}
          />
          <div 
            className="modal" 
            role="dialog" 
            aria-modal="true"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              zIndex: 1001,
              maxWidth: '800px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div className="modal-panel">
              <button 
                className="modal-close" 
                onClick={closeStudentDetails} 
                aria-label="Close"
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '15px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
              
              <div className="resume-container" style={{ display: 'flex', gap: '20px' }}>
                {/* LEFT / HEADER SECTION */}
                <div className="resume-left" style={{ flex: 1 }}>
                  {selectedStudent.profilePic ? (
                    <img
                      className="profile-pic"
                      src={
                        selectedStudent.profilePic.startsWith("http")
                          ? selectedStudent.profilePic
                          : `${API_URL}${selectedStudent.profilePic}`
                      }
                      alt="profile"
                      style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid #4CAF50',
                        marginBottom: '15px'
                      }}
                    />
                  ) : (
                    <div 
                      className="profile-placeholder"
                      style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '3px solid #ddd',
                        marginBottom: '15px',
                        color: '#666'
                      }}
                    >
                      No Photo
                    </div>
                  )}
                  
                  <h3 
                    className="resume-name" 
                    style={{ 
                      margin: '0 0 5px 0',
                      color: '#333'
                    }}
                  >
                    {selectedStudent.givenName} {selectedStudent.middleInitial ? selectedStudent.middleInitial + '.' : ''} {selectedStudent.surname}
                  </h3>
                  
                  {/* STUDENT ID DISPLAY - Prominent! */}
                  {selectedStudent.student_id && (
                    <div 
                      className="student-id-display"
                      style={{
                        background: 'linear-gradient(135deg, #4CAF50, #2e7d32)',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        margin: '15px 0',
                        boxShadow: '0 2px 10px rgba(76, 175, 80, 0.3)'
                      }}
                    >
                      <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '3px' }}>
                        STUDENT ID
                      </div>
                      <div 
                        style={{ 
                          fontSize: '28px', 
                          fontWeight: 'bold',
                          letterSpacing: '2px',
                          fontFamily: "'Courier New', monospace"
                        }}
                      >
                        {selectedStudent.student_id}
                      </div>
                    </div>
                  )}
                  
                  <p className="resume-contact" style={{ margin: '5px 0', fontSize: '14px' }}>
                    <strong>Email:</strong> {selectedStudent.email}
                  </p>
                  <p className="resume-contact" style={{ margin: '5px 0', fontSize: '14px' }}>
                    <strong>Contact:</strong> {selectedStudent.contact || 'N/A'}
                  </p>
                  
                  <div className="student-info" style={{ marginTop: '20px' }}>
                    <h4 className="section-title" style={{ 
                      borderBottom: '2px solid #4CAF50', 
                      paddingBottom: '5px',
                      color: '#333'
                    }}>
                      Enrollment Status
                    </h4>
                    <ul className="details-list" style={{ listStyle: 'none', padding: 0 }}>
                      <li style={{ margin: '8px 0' }}>
                        <strong>Status:</strong> 
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '4px',
                          backgroundColor: 
                            selectedStudent.status === 'Approved' ? '#4CAF50' :
                            selectedStudent.status === 'Rejected' ? '#f44336' : '#ff9800',
                          color: 'white',
                          marginLeft: '10px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {selectedStudent.status}
                        </span>
                      </li>
                      {selectedStudent.student_id && (
                        <li style={{ margin: '8px 0' }}>
                          <strong>Student ID:</strong> 
                          <span style={{
                            backgroundColor: '#e8f5e9',
                            padding: '3px 10px',
                            borderRadius: '4px',
                            marginLeft: '10px',
                            fontFamily: "'Courier New', monospace",
                            fontWeight: 'bold',
                            color: '#2e7d32'
                          }}>
                            {selectedStudent.student_id}
                          </span>
                        </li>
                      )}
                      {selectedStudent.rejectionReason && (
                        <li style={{ margin: '8px 0' }}>
                          <strong>Reason:</strong> 
                          <span style={{ 
                            marginLeft: '10px',
                            color: '#d32f2f',
                            fontSize: '14px'
                          }}>
                            {selectedStudent.rejectionReason}
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                
                {/* RIGHT / DETAILS SECTION */}
                <div className="resume-right" style={{ flex: 2 }}>
                  <h4 className="section-title" style={{ 
                    borderBottom: '2px solid #2196F3', 
                    paddingBottom: '5px',
                    color: '#333',
                    marginTop: '0'
                  }}>
                    Academic Details
                  </h4>
                  <div className="details-grid student-info" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '20px'
                  }}>
                    <div className="detail-item" style={{ display: 'flex' }}>
                      <div className="detail-label" style={{ fontWeight: 'bold', minWidth: '100px' }}>Course:</div>
                      <div className="detail-value">{selectedStudent.course}</div>
                    </div>
                    <div className="detail-item" style={{ display: 'flex' }}>
                      <div className="detail-label" style={{ fontWeight: 'bold', minWidth: '100px' }}>Year/Sem:</div>
                      <div className="detail-value">{selectedStudent.yearLevel} / {selectedStudent.semester}</div>
                    </div>
                  </div>

                  <h4 className="section-title" style={{ 
                    borderBottom: '2px solid #2196F3', 
                    paddingBottom: '5px',
                    color: '#333'
                  }}>
                    Personal Details
                  </h4>
                  <div className="details-grid student-info" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '20px'
                  }}>
                    <div className="detail-item" style={{ display: 'flex' }}>
                      <div className="detail-label" style={{ fontWeight: 'bold', minWidth: '100px' }}>Gender:</div>
                      <div className="detail-value">{selectedStudent.gender}</div>
                    </div>
                    <div className="detail-item" style={{ display: 'flex' }}>
                      <div className="detail-label" style={{ fontWeight: 'bold', minWidth: '100px' }}>DOB:</div>
                      <div className="detail-value">{selectedStudent.dob}</div>
                    </div>
                    <div className="detail-item" style={{ display: 'flex' }}>
                      <div className="detail-label" style={{ fontWeight: 'bold', minWidth: '100px' }}>Age:</div>
                      <div className="detail-value">{selectedStudent.age}</div>
                    </div>
                    <div className="detail-item" style={{ display: 'flex' }}>
                      <div className="detail-label" style={{ fontWeight: 'bold', minWidth: '100px' }}>Civil Status:</div>
                      <div className="detail-value">{selectedStudent.civilStatus}</div>
                    </div>
                    <div className="detail-item" style={{ display: 'flex' }}>
                      <div className="detail-label" style={{ fontWeight: 'bold', minWidth: '100px' }}>Nationality:</div>
                      <div className="detail-value">{selectedStudent.nationality}</div>
                    </div>
                    <div className="detail-item" style={{ gridColumn: '1 / 3', display: 'flex' }}>
                      <div className="detail-label" style={{ fontWeight: 'bold', minWidth: '100px' }}>Address:</div>
                      <div className="detail-value">{selectedStudent.address}</div>
                    </div>
                  </div>

                  <h4 className="section-title" style={{ 
                    borderBottom: '2px solid #2196F3', 
                    paddingBottom: '5px',
                    color: '#333'
                  }}>
                    Parent/Guardian Details
                  </h4>
                  <div className="details-grid student-info" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '20px'
                  }}>
                    <div className="detail-item" style={{ display: 'flex' }}>
                      <div className="detail-label" style={{ fontWeight: 'bold', minWidth: '100px' }}>Father:</div>
                      <div className="detail-value">{selectedStudent.father}</div>
                    </div>
                    <div className="detail-item" style={{ display: 'flex' }}>
                      <div className="detail-label" style={{ fontWeight: 'bold', minWidth: '100px' }}>Father Occ.:</div>
                      <div className="detail-value">{selectedStudent.fatherOccupation}</div>
                    </div>
                    <div className="detail-item" style={{ display: 'flex' }}>
                      <div className="detail-label" style={{ fontWeight: 'bold', minWidth: '100px' }}>Mother:</div>
                      <div className="detail-value">{selectedStudent.mother}</div>
                    </div>
                    <div className="detail-item" style={{ display: 'flex' }}>
                      <div className="detail-label" style={{ fontWeight: 'bold', minWidth: '100px' }}>Mother Occ.:</div>
                      <div className="detail-value">{selectedStudent.motherOccupation}</div>
                    </div>
                    <div className="detail-item" style={{ display: 'flex' }}>
                      <div className="detail-label" style={{ fontWeight: 'bold', minWidth: '100px' }}>Guardian:</div>
                      <div className="detail-value">{selectedStudent.guardian || 'N/A'}</div>
                    </div>
                  </div>

                  <h4 className="section-title" style={{ 
                    borderBottom: '2px solid #2196F3', 
                    paddingBottom: '5px',
                    color: '#333'
                  }}>
                    Documents
                  </h4>
                  <div className="details-grid student-info" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '20px'
                  }}>
                    {selectedStudent.birthCertificate && (
                        <div className="detail-item" style={{ display: 'flex' }}>
                            <div className="detail-label" style={{ fontWeight: 'bold', minWidth: '100px' }}>Birth Cert:</div>
                            <div className="detail-value">
                                <a 
                                  href={`${API_URL}${selectedStudent.birthCertificate}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  style={{
                                    color: '#2196F3',
                                    textDecoration: 'none'
                                  }}
                                >
                                  📄 View File
                                </a>
                            </div>
                        </div>
                    )}
                    {selectedStudent.goodMoral && (
                        <div className="detail-item" style={{ display: 'flex' }}>
                            <div className="detail-label" style={{ fontWeight: 'bold', minWidth: '100px' }}>Good Moral:</div>
                            <div className="detail-value">
                                <a 
                                  href={`${API_URL}${selectedStudent.goodMoral}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  style={{
                                    color: '#2196F3',
                                    textDecoration: 'none'
                                  }}
                                >
                                  📄 View File
                                </a>
                            </div>
                        </div>
                    )}
                  </div>

                  <div className="modal-footer" style={{ 
                    marginTop: '20px', 
                    paddingTop: '15px', 
                    borderTop: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px'
                  }}>
                    {selectedStudent.status === 'Pending' && (
                        <>
                            <button 
                              className="btn-accept" 
                              onClick={() => {
                                handleApprove(selectedStudent.email);
                                closeStudentDetails();
                              }}
                              style={{
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold'
                              }}
                            >
                              Approve & Assign ID
                            </button>
                            <button 
                              className="btn-reject" 
                              onClick={() => {
                                handleReject(selectedStudent.email);
                                closeStudentDetails();
                              }}
                              style={{
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold'
                              }}
                            >
                              Reject
                            </button>
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
