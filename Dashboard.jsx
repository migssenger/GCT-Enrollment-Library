import React, { useEffect, useState, useRef } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function Dashboard({ user }) {
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const receiptRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:3001/enrollment/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setEnrollment(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching enrollment:", err);
        setLoading(false);
      });
  }, [user]);

  // Function to generate and download PDF receipt
  const generateReceiptPDF = async () => {
    if (!receiptRef.current || !enrollment) return;

    try {
      // Create canvas from receipt content
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123 // A4 height in pixels at 96 DPI
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Calculate dimensions to fit on one page
      const imgWidth = pageWidth - 20; // 10mm margins on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      // Save PDF with student name
      const fileName = `Enrollment-Receipt-${enrollment.surname}-${enrollment.givenName}-${Date.now().toString().slice(-6)}.pdf`;
      pdf.save(fileName);
      
      // Close modal after download
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

  if (loading) return <p className="text-center mt-10">Loading your dashboard...</p>;

  if (!enrollment)
    return (
      <div className="dashboard-card text-center">
        <h2 className="welcome">Welcome {user.email}</h2>
        <p className="submit">You haven't submitted your enrollment yet.</p>
      </div>
    );

  return (
    <div className="dashboard-card">
      <h2 className="text-2xl font-bold mb-6 text-center">Enrollment Information</h2>

      {/* Add Download Receipt Button for Approved Students */}
      {enrollment.status === "Approved" && (
        <div className="mb-6 text-center">
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <h3 className="text-xl font-bold text-green-800 mb-2">
             Your Enrollment Form is Approved
            </h3>
            {enrollment.studentId && (
              <p className="text-lg font-semibold text-gray-800">
                Your Student ID: <span className="text-blue-600 font-bold text-xl">{enrollment.studentId}</span>
              </p>
            )}
            <p className="text-sm text-gray-600 mt-1">
              Save this ID for all academic transactions
            </p>
          </div>
          
          <button
            onClick={() => setShowReceiptModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
          >
            📄 Download Enrollment Receipt
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Generate official receipt for your approved enrollment
          </p>
        </div>
      )}

      {/* Profile Picture */}
      {enrollment.profilePic && (
        <div className="flex justify-center mb-6">
          <img
            src={`http://localhost:3001${enrollment.profilePic}`}
            alt="Profile"
            className="dashboard-profile-pic"
          />
        </div>
      )}

      {/* Personal Information Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-600 border-b pb-2">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p><strong className="text-gray-700">Full Name:</strong> {enrollment.givenName} {enrollment.middleInitial} {enrollment.surname}</p>
            <p><strong className="text-gray-700">Gender:</strong> {enrollment.gender}</p>
            <p><strong className="text-gray-700">Date of Birth:</strong> {new Date(enrollment.dob).toLocaleDateString()}</p>
            <p><strong className="text-gray-700">Age:</strong> {enrollment.age}</p>
            <p><strong className="text-gray-700">Civil Status:</strong> {enrollment.civilStatus}</p>
          </div>
          <div className="space-y-2">
            {/* Display Student ID prominently */}
            {enrollment.studentId && (
              <p className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <strong className="text-gray-700 block mb-1">Student ID:</strong> 
                <span className="font-bold text-blue-700 text-2xl">{enrollment.studentId}</span>
              </p>
            )}
            <p><strong className="text-gray-700">Nationality:</strong> {enrollment.nationality}</p>
            <p><strong className="text-gray-700">Address:</strong> {enrollment.address}</p>
            <p><strong className="text-gray-700">Contact Number:</strong> {enrollment.contact}</p>
            <p><strong className="text-gray-700">Email:</strong> {enrollment.email}</p>
          </div>
        </div>
      </div>

      {/* Academic Information Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-600 border-b pb-2">
          Academic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p><strong className="text-gray-700">Course:</strong> {enrollment.course}</p>
            <p><strong className="text-gray-700">Year Level:</strong> {enrollment.yearLevel}</p>
            <p><strong className="text-gray-700">Semester:</strong> {enrollment.semester}</p>
            {enrollment.studentId && (
              <p className="mt-2">
                <strong className="text-gray-700">Student ID:</strong> 
                <span className="ml-2 font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">{enrollment.studentId}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Family Background Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-600 border-b pb-2">
          Family Background
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Father's Information</h4>
            <p><strong className="text-gray-700">Name:</strong> {enrollment.father}</p>
            <p><strong className="text-gray-700">Occupation:</strong> {enrollment.fatherOccupation}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Mother's Information</h4>
            <p><strong className="text-gray-700">Name:</strong> {enrollment.mother}</p>
            <p><strong className="text-gray-700">Occupation:</strong> {enrollment.motherOccupation}</p>
          </div>
        </div>
        {enrollment.guardian && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Guardian's Information</h4>
            <p><strong className="text-gray-700">Name:</strong> {enrollment.guardian}</p>
          </div>
        )}
      </div>

      {/* Uploaded Documents Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-600 border-b pb-2">
          Uploaded Documents
        </h3>
        <div className="space-y-3">
          {enrollment.birthCertificate && (
            <div className="flex items-center space-x-3">
              <span className="text-green-600">✓</span>
              <span>Birth Certificate: </span>
              <a 
                href={`http://localhost:3001${enrollment.birthCertificate}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Document
              </a>
            </div>
          )}
          {enrollment.goodMoral && (
            <div className="flex items-center space-x-3">
              <span className="text-green-600">✓</span>
              <span>Good Moral Certificate: </span>
              <a 
                href={`http://localhost:3001${enrollment.goodMoral}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Document
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Enrollment Status Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-600 border-b pb-2">
          Enrollment Status
        </h3>
        <div className="status-box">
          {enrollment.status === "Pending" && (
            <div className="text-center py-4">
              <p className="text-yellow-600 font-semibold text-lg">
                🕓 Your enrollment is pending for admin review.
              </p>
              <p className="text-gray-600 mt-2">
                Submitted on: {new Date(enrollment.submittedAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          )}
          {enrollment.status === "Approved" && (
            <div className="text-center py-4">
              <p className="text-green-600 font-semibold text-lg">
                ✅ Your enrollment has been approved!
              </p>
              {enrollment.studentId && (
                <div className="my-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">
                    Student ID: <span className="text-2xl">{enrollment.studentId}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    This is your official student identification number
                  </p>
                </div>
              )}
              <p className="text-gray-600 mt-2">
                Approved on: {new Date(enrollment.updatedAt || enrollment.approvedAt || Date.now()).toLocaleDateString()}
              </p>
              <button
                onClick={() => setShowReceiptModal(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                Get Enrollment Receipt
              </button>
            </div>
          )}
          {enrollment.status === "Rejected" && (
            <div className="text-center py-4">
              <p className="text-red-600 font-semibold text-lg mb-2">
                ❌ Your enrollment was rejected.
              </p>
              {enrollment.rejectionReason && (
                <div className="bg-red-50 p-4 rounded-lg mt-3">
                  <p className="text-gray-800 font-semibold mb-1">Reason for rejection:</p>
                  <p className="text-gray-700">{enrollment.rejectionReason}</p>
                </div>
              )}
              <p className="text-gray-600 mt-3">
                Last updated: {new Date(enrollment.updatedAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Receipt Generation Modal */}
      {showReceiptModal && enrollment.status === "Approved" && (
        <>
          <div className="modal-backdrop" onClick={() => setShowReceiptModal(false)} />
          <div className="modal" role="dialog" aria-modal="true" style={{ zIndex: 2000 }}>
            <div className="modal-panel" style={{ width: '210mm', maxWidth: '210mm', maxHeight: '90vh', overflowY: 'auto' }}>
              <button className="modal-close" onClick={() => setShowReceiptModal(false)} aria-label="Close">×</button>
              
              {/* Printable receipt content */}
              <div ref={receiptRef} className="receipt-container" style={{
                width: '210mm',
                minHeight: '297mm',
                padding: '20mm',
                backgroundColor: 'white',
                boxSizing: 'border-box',
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px',
                lineHeight: '1.4'
              }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '15px' }}>
                  <h1 style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>ENROLLMENT CONFIRMATION RECEIPT</h1>
                  <h2 style={{ margin: '5px 0', fontSize: '20px', color: '#2c3e50' }}>UNIVERSITY ENROLLMENT SYSTEM</h2>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>Official Receipt of Enrollment Confirmation</p>
                  <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                    Receipt No: {generateReceiptNumber()} | Date: {new Date().toLocaleDateString()}
                  </p>
                </div>

                {/* Student Information */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ backgroundColor: '#f0f0f0', padding: '8px', fontSize: '16px', marginBottom: '15px' }}>
                    STUDENT INFORMATION
                  </h3>
                  
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', width: '30%', fontWeight: 'bold' }}>Full Name:</td>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', width: '70%' }}>
                          {enrollment.givenName} {enrollment.middleInitial} {enrollment.surname}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Student ID:</td>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>
                          {enrollment.studentId || 'Not Assigned'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Email:</td>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>{enrollment.email}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Contact:</td>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>{enrollment.contact}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Date of Birth:</td>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>
                          {new Date(enrollment.dob).toLocaleDateString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Academic Details */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ backgroundColor: '#f0f0f0', padding: '8px', fontSize: '16px', marginBottom: '15px' }}>
                    ACADEMIC DETAILS
                  </h3>
                  
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', width: '30%', fontWeight: 'bold' }}>Course:</td>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', width: '70%' }}>{enrollment.course}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Year Level:</td>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>{enrollment.yearLevel}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Semester:</td>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>{enrollment.semester}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Academic Year:</td>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>
                          {new Date().getFullYear()}-{new Date().getFullYear() + 1}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Enrollment Timeline */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ backgroundColor: '#f0f0f0', padding: '8px', fontSize: '16px', marginBottom: '15px' }}>
                    ENROLLMENT TIMELINE
                  </h3>
                  
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', width: '30%', fontWeight: 'bold' }}>Application Date:</td>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', width: '70%' }}>
                          {formatDateForReceipt(enrollment.submittedAt || enrollment.createdAt || Date.now())}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Approval Date:</td>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>
                          {formatDateForReceipt(enrollment.updatedAt || enrollment.approvedAt || Date.now())}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Status:</td>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', color: 'green', fontWeight: 'bold' }}>
                          APPROVED ✓
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Documents Submitted */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ backgroundColor: '#f0f0f0', padding: '8px', fontSize: '16px', marginBottom: '15px' }}>
                    DOCUMENTS SUBMITTED
                  </h3>
                  
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', width: '70%' }}>Birth Certificate</td>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', textAlign: 'center', color: 'green' }}>
                          {enrollment.birthCertificate ? '✓ Submitted' : '✗ Pending'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd' }}>Good Moral Certificate</td>
                        <td style={{ padding: '6px', borderBottom: '1px solid #ddd', textAlign: 'center', color: 'green' }}>
                          {enrollment.goodMoral ? '✓ Submitted' : '✗ Pending'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Important Notes */}
                <div style={{
                  marginTop: '30px',
                  padding: '15px',
                  border: '1px solid #ccc',
                  backgroundColor: '#f9f9f9',
                  fontSize: '11px'
                }}>
                  <h4 style={{ marginTop: '0', color: '#d35400' }}>IMPORTANT NOTES:</h4>
                  <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                    <li>This receipt confirms your enrollment approval.</li>
                    <li>Keep this receipt for your records and present it during registration.</li>
                    <li>Your Student ID ({enrollment.studentId}) is your official identification number.</li>
                    <li>All submitted documents have been verified and approved.</li>
                    <li>For any queries, contact the registrar's office.</li>
                    <li>This receipt is valid for the current academic year only.</li>
                  </ul>
                </div>

                {/* Signatures */}
                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ textAlign: 'center', width: '45%' }}>
                    <div style={{ borderTop: '1px solid #000', paddingTop: '10px', marginTop: '40px' }}>
                      <p style={{ margin: '0', fontWeight: 'bold' }}>Student's Signature</p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '11px' }}>{enrollment.givenName} {enrollment.surname}</p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '10px', color: '#666' }}>Date: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center', width: '45%' }}>
                    <div style={{ borderTop: '1px solid #000', paddingTop: '10px', marginTop: '40px' }}>
                      <p style={{ margin: '0', fontWeight: 'bold' }}>Registrar's Signature</p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '11px' }}>University Registrar</p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '10px', color: '#666' }}>Date: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{
                  marginTop: '30px',
                  paddingTop: '10px',
                  borderTop: '2px solid #000',
                  textAlign: 'center',
                  fontSize: '10px',
                  color: '#666'
                }}>
                  <p style={{ margin: '0' }}>This is a computer-generated receipt. No physical signature is required.</p>
                  <p style={{ margin: '5px 0' }}>Generated on: {new Date().toLocaleString()}</p>
                  <p style={{ margin: '0', fontStyle: 'italic' }}>Keep this receipt safe. Do not share with unauthorized persons.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ textAlign: 'center', marginTop: '20px', padding: '15px', borderTop: '1px solid #eee' }}>
                <button 
                  onClick={generateReceiptPDF}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  📥 Download PDF Receipt
                </button>
                <button 
                  onClick={() => setShowReceiptModal(false)}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
