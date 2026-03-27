const sqlite3 = require("sqlite3").verbose();

// Create / connect to database file 
const db = new sqlite3.Database("university.db", (err) => {
  if (err) {
    console.error("Connection error:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    courseCode TEXT,
    title TEXT,
    credits INTEGER, 
    description TEXT, 
    semester TEXT
  )
`, (err) => {
  if (err) {
    console.error("Error creating table:", err.message);
  } else {
    console.log("Courses table is ready");
  }

  // Close DB after operation finishes
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed");
    }
  });
});