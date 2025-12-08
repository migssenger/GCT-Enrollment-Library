// check_db.js - Quick check
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("ngilo.db");

const checks = [
  "SELECT COUNT(*) as count FROM enrollment",
  "SELECT COUNT(*) as count FROM enrollment WHERE status = 'Approved'",
  "SELECT COUNT(*) as count FROM enrollment WHERE student_id IS NOT NULL",
  "SELECT last_student_id FROM student_id_counter WHERE id = 1"
];

Promise.all(checks.map(query => {
  return new Promise((resolve, reject) => {
    db.get(query, (err, row) => {
      if (err) reject(err);
      else resolve({ query, result: row });
    });
  });
}))
.then(results => {
  console.log("📊 Database Status Report");
  console.log("========================");
  console.log(`Total enrollments: ${results[0].result.count}`);
  console.log(`Approved enrollments: ${results[1].result.count}`);
  console.log(`Enrollments with student ID: ${results[2].result.count}`);
  console.log(`Next student ID: ${String(results[3].result.last_student_id + 1).padStart(5, '0')}`);
})
.catch(err => {
  console.error("❌ Error:", err.message);
})
.finally(() => {
  db.close();
});