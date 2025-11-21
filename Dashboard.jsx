import React, { useEffect, useState } from "react";

function Dashboard({ user }) {
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:4000/enrollment/${user.email}`)
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

  if (loading) return <p className="text-center mt-10">Loading your dashboard...</p>;

  if (!enrollment)
    return (
      <div className="dashboard-card text-center">
        <h2 className="welcome">Welcome {user.email}</h2>
        <p className="submit">You haven’t submitted your enrollment yet.</p>
      </div>
    );

  return (
    <div className="dashboard-card">
      <h2 className="text-2xl font-bold mb-6 text-center">Enrollment Status</h2>

      {/* Profile Picture */}
      {enrollment.profilePic && (
        <div className="flex justify-center mb-6">
          <img
            src={`http://localhost:4000${enrollment.profilePic}`}
            alt="Profile"
            className="dashboard-profile-pic"
          />
        </div>
      )}

      {/* Student Info */}
      <div className="mb-6 space-y-2 text-gray-800">
        <p><strong>Name:</strong> {enrollment.givenName} {enrollment.surname}</p>
        <p><strong>Course:</strong> {enrollment.course}</p>
        <p><strong>Semester:</strong> {enrollment.semester}</p>
      </div>

      {/* Enrollment Status */}
      <div className="status-box">
        {enrollment.status === "Pending" && (
          <p className="text-yellow-600 font-semibold">
            🕓 Your enrollment is pending for admin review.
          </p>
        )}
        {enrollment.status === "Approved" && (
          <p className="text-green-600 font-semibold">
            ✅ Your enrollment has been approved!
          </p>
        )}
        {enrollment.status === "Rejected" && (
          <div>
            <p className="text-red-600 font-semibold mb-2">
              ❌ Your enrollment was rejected.
            </p>
            {enrollment.rejectionReason && (
              <p className="text-gray-700">
                <strong>Reason:</strong> {enrollment.rejectionReason}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
