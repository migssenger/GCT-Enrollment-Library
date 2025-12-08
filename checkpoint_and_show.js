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

(async () => {
  try {
    console.log("Running WAL checkpoint (TRUNCATE)...");
    await run("PRAGMA wal_checkpoint(TRUNCATE);");
    console.log("Checkpoint complete. Now reading enrollment rows:");

    const rows = await all(`SELECT id, email, student_id, status FROM enrollment ORDER BY id ASC`);
    for (const r of rows) {
      console.log(r);
    }
  } catch (err) {
    console.error("Error:", err.message);
    process.exitCode = 1;
  } finally {
    db.close();
  }
})();
