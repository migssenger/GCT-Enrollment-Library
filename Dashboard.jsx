import React, { useEffect, useState, useRef } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

function Dashboard({ user }) {
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const receiptRef = useRef(null);

  useEffect(() => {
  if (!user) return;

  console.log("🔍 Fetching enrollment for:", user.email);
  
  fetch(`${API_URL}/enrollment/${user.email}`)
    .then((res) => {
      console.log("📡 API Response status:", res.status);
      return res.json();
    })
    .then((data) => {
      console.log("📦 Backend response data:", data);
      console.log("🎯 Student ID:", data?.studentId || data?.student_id);
      console.log("🖼️ Profile Picture:", data?.profilePic);
      console.log("✅ Status:", data?.status);
      setEnrollment(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("❌ Error fetching enrollment:", err);
      setLoading(false);
    });
}, [user]);

  // Function to generate and download PDF receipt
  const generateReceiptPDF = async () => {
    if (!receiptRef.current || !enrollment) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      const fileName = `Enrollment-Receipt-${enrollment.surname}-${enrollment.givenName}-${Date.now().toString().slice(-6)}.pdf`;
      pdf.save(fileName);
      setShowReceiptModal(false);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate receipt. Please try again.');
    }
  };

  // Format date for receipt
  const formatDateForReceipt = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Generate receipt number
  const generateReceiptNumber = () => {
    if (!enrollment) return '';
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ENR-${year}${month}${day}-${random}`;
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading your dashboard...</p>
    </div>
  );

  if (!enrollment)
    return (
      <div className="empty-dashboard">
        <div className="empty-icon">👤</div>
        <h2>Welcome, {user.email}</h2>
        <p>You haven't submitted your enrollment yet.</p>
        <div className="empty-message">
          <p>Please complete the enrollment form to get started.</p>
        </div>
      </div>
    );

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Student Dashboard</h1>
          <p>Welcome back, {enrollment.givenName} {enrollment.surname}</p>
        </div>
        <div className="header-right">
        <div className="student-id-badge">
          <span>STUDENT ID</span>
          <strong>
            {enrollment.studentId || enrollment.student_id || 'Not Assigned'}
          </strong>
        </div>
          {enrollment.status === 'Approved' && (
            <button 
              className="btn-primary"
              onClick={() => setShowReceiptModal(true)}
            >
              <i className="fas fa-download"></i>
              Download Receipt
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Left Sidebar */}
        <div className="sidebar">
          <div className="profile-card">
            {enrollment.profilePic ? (
              <>
                <img 
                  src={`${API_URL}${enrollment.profilePic}`} 
                  alt="Profile" 
                  className="profile-image"
                  onError={(e) => {
                    console.error("❌ Failed to load profile picture:", e.target.src);
                    e.target.style.display = 'none';
                    const placeholder = document.querySelector('.profile-placeholder-fallback');
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
                <div className="profile-placeholder profile-placeholder-fallback" style={{display: 'none'}}>
                  <i className="fas fa-user"></i>
                </div>
              </>
              ) : (
                <div className="profile-placeholder">
                  <i className="fas fa-user"></i>
                </div>
              )}
  
              <div className="profile-info">
                <h3>{enrollment.givenName} {enrollment.surname}</h3>
                <p className="email">{enrollment.email}</p>
                <p className="contact">{enrollment.contact || 'No contact'}</p>
              </div>
            </div>

          <div className="status-card">
            <div className="status-header">
              <div className={`status-icon status-${(enrollment.status || 'pending').toLowerCase()}`}>
                {enrollment.status === "Approved" ? (
                  <i className="fas fa-check-circle"></i>
                ) : enrollment.status === "Rejected" ? (
                  <i className="fas fa-times-circle"></i>
                ) : (
                  <i className="fas fa-clock"></i>
                )}
              </div>
              <div>
                <p className="status-label">Enrollment Status</p>
                <h3 className={`status-value status-${(enrollment.status || 'pending').toLowerCase()}`}>
                  {enrollment.status}
                </h3>
              </div>
            </div>
            
            <div className="status-details">
              <p className="status-date">
                {enrollment.status === "Approved" 
                  ? `Approved on ${new Date(enrollment.updatedAt || enrollment.approvedAt || Date.now()).toLocaleDateString()}`
                  : enrollment.status === "Rejected"
                  ? `Rejected on ${new Date(enrollment.updatedAt || Date.now()).toLocaleDateString()}`
                  : `Submitted on ${new Date(enrollment.submittedAt || Date.now()).toLocaleDateString()}`
                }
              </p>
              
              {enrollment.status === "Rejected" && enrollment.rejectionReason && (
                <div className="rejection-reason">
                  <p><strong>Reason:</strong> {enrollment.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>

          <div className="quick-info-card">
            <h3 className="card-title">Quick Info</h3>
            <div className="quick-info-grid">
              <div className="info-item">
                <span className="info-label">Course</span>
                <span className="info-value">{enrollment.course}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Year Level</span>
                <span className="info-value">{enrollment.yearLevel}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Semester</span>
                <span className="info-value">{enrollment.semester}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="main-content">
          {/* Academic Information */}
          <div className="content-card">
            <div className="card-header">
              <i className="fas fa-graduation-cap"></i>
              <h2>Academic Information</h2>
            </div>
            <div className="card-body">
              <div className="info-grid">
                <div className="info-field">
                  <label>Course Program</label>
                  <p>{enrollment.course}</p>
                </div>
                <div className="info-field">
                  <label>Year Level</label>
                  <p>{enrollment.yearLevel}</p>
                </div>
                <div className="info-field">
                  <label>Semester</label>
                  <p>{enrollment.semester}</p>
                </div>
                <div className="info-field">
                  <label>Academic Year</label>
                  <p>{new Date().getFullYear()}-{new Date().getFullYear() + 1}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="content-card">
            <div className="card-header">
              <i className="fas fa-user-circle"></i>
              <h2>Personal Information</h2>
            </div>
            <div className="card-body">
              <div className="info-grid">
                <div className="info-field">
                  <label>Gender</label>
                  <p>{enrollment.gender}</p>
                </div>
                <div className="info-field">
                  <label>Date of Birth</label>
                  <p>{new Date(enrollment.dob).toLocaleDateString()}</p>
                </div>
                <div className="info-field">
                  <label>Age</label>
                  <p>{enrollment.age} years</p>
                </div>
                <div className="info-field">
                  <label>Civil Status</label>
                  <p>{enrollment.civilStatus}</p>
                </div>
                <div className="info-field">
                  <label>Nationality</label>
                  <p>{enrollment.nationality}</p>
                </div>
                <div className="info-field full-width">
                  <label>Complete Address</label>
                  <p>{enrollment.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Family Background */}
          <div className="content-card">
            <div className="card-header">
              <i className="fas fa-users"></i>
              <h2>Family Background</h2>
            </div>
            <div className="card-body">
              <div className="family-grid">
                <div className="family-member">
                  <h3>Father</h3>
                  <p className="member-name">{enrollment.father}</p>
                  <p className="member-details">{enrollment.fatherOccupation}</p>
                </div>
                <div className="family-member">
                  <h3>Mother</h3>
                  <p className="member-name">{enrollment.mother}</p>
                  <p className="member-details">{enrollment.motherOccupation}</p>
                </div>
                {enrollment.guardian && (
                  <div className="family-member guardian">
                    <h3>Guardian</h3>
                    <p className="member-name">{enrollment.guardian}</p>
                    <p className="member-details">Legal Guardian</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="content-card">
            <div className="card-header">
              <i className="fas fa-file-alt"></i>
              <h2>Uploaded Documents</h2>
            </div>
            <div className="card-body">
              <div className="documents-grid">
                {enrollment.birthCertificate && (
                  <a 
                    href={`${API_URL}${enrollment.birthCertificate}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="document-item"
                  >
                    <div className="document-icon">
                      <i className="fas fa-certificate"></i>
                    </div>
                    <div className="document-info">
                      <h4>Birth Certificate</h4>
                      <span className="document-status">Submitted ✓</span>
                    </div>
                    <i className="fas fa-external-link-alt"></i>
                  </a>
                )}
                
                {enrollment.goodMoral && (
                  <a 
                    href={`${API_URL}${enrollment.goodMoral}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="document-item"
                  >
                    <div className="document-icon">
                      <i className="fas fa-award"></i>
                    </div>
                    <div className="document-info">
                      <h4>Good Moral Certificate</h4>
                      <span className="document-status">Submitted ✓</span>
                    </div>
                    <i className="fas fa-external-link-alt"></i>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && enrollment.status === "Approved" && (
        <div className="modal-overlay" onClick={() => setShowReceiptModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Enrollment Receipt</h2>
              <button className="close-btn" onClick={() => setShowReceiptModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div ref={receiptRef} className="receipt-preview">
                <div className="receipt-header">
                  <h1>ENROLLMENT CONFIRMATION RECEIPT</h1>
                  <h2>UNIVERSITY ENROLLMENT SYSTEM</h2>
                  <div className="receipt-meta">
                    <div>
                      <span>Receipt No:</span>
                      <strong>{generateReceiptNumber()}</strong>
                    </div>
                    <div>
                      <span>Date:</span>
                      <strong>{new Date().toLocaleDateString()}</strong>
                    </div>
                  </div>
                </div>

                <div className="receipt-section">
                  <h3>STUDENT INFORMATION</h3>
                  <div className="receipt-grid">
                    <div>
                      <p>Full Name</p>
                      <p><strong>{enrollment.givenName} {enrollment.middleInitial} {enrollment.surname}</strong></p>
                    </div>
                    <div>
                      <p>Student ID</p>
                      <p><strong className="student-id">{enrollment.studentId || enrollment.student_id}</strong></p>
                    </div>
                    <div>
                      <p>Email</p>
                      <p>{enrollment.email}</p>
                    </div>
                    <div>
                      <p>Contact</p>
                      <p>{enrollment.contact}</p>
                    </div>
                  </div>
                </div>

                <div className="receipt-section">
                  <h3>ACADEMIC DETAILS</h3>
                  <div className="receipt-grid">
                    <div>
                      <p>Course</p>
                      <p><strong>{enrollment.course}</strong></p>
                    </div>
                    <div>
                      <p>Year Level</p>
                      <p><strong>{enrollment.yearLevel}</strong></p>
                    </div>
                    <div>
                      <p>Semester</p>
                      <p><strong>{enrollment.semester}</strong></p>
                    </div>
                    <div>
                      <p>Academic Year</p>
                      <p><strong>{new Date().getFullYear()}-{new Date().getFullYear() + 1}</strong></p>
                    </div>
                  </div>
                </div>

                <div className="receipt-section">
                  <h3>ENROLLMENT TIMELINE</h3>
                  <div className="receipt-timeline">
                    <div>
                      <span>Application Date:</span>
                      <span><strong>{formatDateForReceipt(enrollment.submittedAt || enrollment.createdAt || Date.now())}</strong></span>
                    </div>
                    <div>
                      <span>Approval Date:</span>
                      <span><strong className="approved-date">{formatDateForReceipt(enrollment.updatedAt || enrollment.approvedAt || Date.now())}</strong></span>
                    </div>
                    <div>
                      <span>Status:</span>
                      <span><strong className="status-approved">APPROVED ✓</strong></span>
                    </div>
                  </div>
                </div>

                <div className="receipt-section">
                  <h3>DOCUMENTS SUBMITTED</h3>
                  <div className="receipt-documents">
                    <div>
                      <span>Birth Certificate</span>
                      <span className={`document-status ${enrollment.birthCertificate ? 'submitted' : 'pending'}`}>
                        {enrollment.birthCertificate ? '✓ Submitted' : '✗ Pending'}
                      </span>
                    </div>
                    <div>
                      <span>Good Moral Certificate</span>
                      <span className={`document-status ${enrollment.goodMoral ? 'submitted' : 'pending'}`}>
                        {enrollment.goodMoral ? '✓ Submitted' : '✗ Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="receipt-notes">
                  <h4>📌 IMPORTANT NOTES:</h4>
                  <ul>
                    <li>This receipt confirms your enrollment approval.</li>
                    <li>Keep this receipt for your records and present it during registration.</li>
                    <li>Your Student ID ({enrollment.studentId || enrollment.student_id}) is your official identification number.</li>
                  </ul>
                </div>

                <div className="receipt-signatures">
                  <div className="signature">
                    <div className="signature-line"></div>
                    <p>Student's Signature</p>
                    <p>{enrollment.givenName} {enrollment.surname}</p>
                    <p>Date: {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="signature">
                    <div className="signature-line"></div>
                    <p>Registrar's Signature</p>
                    <p>University Registrar</p>
                    <p>Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button
                onClick={generateReceiptPDF}
                className="btn-primary"
              >
                <i className="fas fa-download"></i>
                Download PDF Receipt
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="btn-secondary"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
