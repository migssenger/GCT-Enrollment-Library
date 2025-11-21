import React, { useState } from "react";

function Enroll({ user, setMode, setEnrolled, setProfilePic }) {
  const [form, setForm] = useState({
    surname: "", givenName: "", middleInitial: "",
    gender: "", dob: "", age: "",
    civilStatus: "", course: "", semester: "",
    address: "", contact: "", father: "", mother: "", guardian: "",
  });
  const [profileFile, setProfileFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setProfileFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    formData.append("email", user.email);
    if (profileFile) formData.append("profilePic", profileFile);

    try {
      const res = await fetch("http://localhost:4000/enroll", {
        method: "POST",
        body: formData, // do NOT set Content-Type
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Enrollment successful!");
        setEnrolled(true);
        setProfilePic(data.profilePic);
        setMode("dashboard");
      } else {
        setMessage("Enrollment failed. Try again.");
      }
    } catch (err) {
      setMessage("Error connecting to server.");
      console.error(err);
    }
  };

  return (
    <div
      style={{
        maxWidth: "650px",
        margin: "20px auto",
        padding: "20px",
        backgroundColor: "#f0f4ff",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Enrollment Form</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Name Fields */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            name="surname"
            placeholder="Surname"
            value={form.surname}
            onChange={handleChange}
            required
            style={{ flex: 1, padding: "8px", borderRadius: "5px" }}
          />
          <input
            name="givenName"
            placeholder="Given Name"
            value={form.givenName}
            onChange={handleChange}
            required
            style={{ flex: 1, padding: "8px", borderRadius: "5px" }}
          />
          <input
            name="middleInitial"
            placeholder="M.I."
            value={form.middleInitial}
            onChange={handleChange}
            style={{ width: "60px", padding: "8px", borderRadius: "5px" }}
          />
        </div>

        {/* Gender, DOB, Age */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            style={{ flex: 1, padding: "8px", borderRadius: "5px" }}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            required
            style={{ flex: 1, padding: "8px", borderRadius: "5px" }}
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            required
            style={{ width: "80px", padding: "8px", borderRadius: "5px" }}
          />
        </div>

        {/* Civil Status, Course, Semester */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <select
            name="civilStatus"
            value={form.civilStatus}
            onChange={handleChange}
            required
            style={{ flex: 1, padding: "8px", borderRadius: "5px" }}
          >
            <option value="">Civil Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
          </select>

          <select
            name="course"
            value={form.course}
            onChange={handleChange}
            required
            style={{ flex: 2, padding: "8px", borderRadius: "5px" }}
          >
            <option value="">Select Course</option>
            <option value="BS Computer Science">BS Computer Science</option>
            <option value="BS Information Technology">BS Information Technology</option>
            <option value="BS Information Systems">BS Information Systems</option>
            <option value="BS Electrical Engineering">BS Electronics Engineering</option>
            <option value="BS Civil Engineering">BS Civil Engineering</option>
            <option value="BS Mechanical Engineering">BS Mechanical Engineering</option>
            <option value="BS Accountancy">BS Accountancy</option>
            <option value="BS Business Administration">BS Business Administration</option>
            <option value="BS Hospitality Management">BS Hospitality Management</option>
            <option value="BS Office Administration">BS Office Administration</option>
          </select>

          <select
            name="semester"
            value={form.semester}
            onChange={handleChange}
            required
            style={{ flex: 1, padding: "8px", borderRadius: "5px" }}
          >
            <option value="">Semester</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
          </select>
        </div>

        {/* Address & Contact */}
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px" }}
        />
        <input
          name="contact"
          placeholder="Contact Number"
          value={form.contact}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px" }}
        />

        {/* Parents / Guardian */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            name="father"
            placeholder="Father’s Name"
            value={form.father}
            onChange={handleChange}
            style={{ flex: 1, padding: "8px", borderRadius: "5px" }}
          />
          <input
            name="mother"
            placeholder="Mother’s Name"
            value={form.mother}
            onChange={handleChange}
            style={{ flex: 1, padding: "8px", borderRadius: "5px" }}
          />
          <input
            name="guardian"
            placeholder="Guardian’s Name"
            value={form.guardian}
            onChange={handleChange}
            style={{ flex: 1, padding: "8px", borderRadius: "5px" }}
          />
        </div>

        {/* Profile Picture */}
        <label style={{ marginBottom: "5px", display: "block" }}>Profile Picture:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: "15px" }}
        />

        {/* Submit */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4a90e2",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Submit Enrollment
        </button>
      </form>

      {message && <p style={{ marginTop: "15px", textAlign: "center" }}>{message}</p>}
    </div>
  );
}

export default Enroll;
