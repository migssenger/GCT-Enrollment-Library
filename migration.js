// migration.js
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("ngilo.db");

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function migration() {
  try {
    // Check whether the enrollment table already has student_id
    const cols = await all("PRAGMA table_info(enrollment);");
    const hasStudentId = cols.some(c => c.name === "student_id");

    if (!hasStudentId) {
      await run("ALTER TABLE enrollment ADD COLUMN student_id TEXT");
      console.log("Added column 'student_id' to 'enrollment'.");
    } else {
      console.log("Column 'student_id' already exists — skipping ALTER TABLE.");
    }

    // Create counter table if it doesn't exist
    await run(`
      CREATE TABLE IF NOT EXISTS student_id_counter (
        id INTEGER PRIMARY KEY,
        last_student_id INTEGER DEFAULT 10000
      )
    `);

    // Initialize counter row
    await run(`
      INSERT OR IGNORE INTO student_id_counter (id, last_student_id)
      VALUES (1, 10000)
    `);

    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("❌ Migration error:", err.message);
    process.exitCode = 1;
  } finally {
    db.close();
  }
}

migration();