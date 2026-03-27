const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());

const db = new sqlite3.Database('./database/university.db');

// =====================
// GET all courses
// =====================
app.get('/api/courses', (req, res) => {
    db.all('SELECT * FROM courses', (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// =====================
// GET single course
// =====================
app.get('/api/courses/:id', (req, res) => {
    const id = req.params.id;

    db.get('SELECT * FROM courses WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(row);
    });
});

// =====================
// POST new course
// =====================
app.post('/api/courses', (req, res) => {
    const { courseCode, title, credits, description, semester } = req.body;

    db.run(
        `INSERT INTO courses (courseCode, title, credits, description, semester)
         VALUES (?, ?, ?, ?, ?)`,
        [courseCode, title, credits, description, semester],
        function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: err.message });
            }

            res.json({ id: this.lastID });
        }
    );
});

// =====================
// UPDATE course
// =====================
app.put('/api/courses/:courseCode', (req, res) => {
    const courseCode = req.params.courseCode;
    const { title, credits, description, semester } = req.body;

    db.run(
        `UPDATE courses 
         SET title = ?, credits = ?, description = ?, semester = ?
         WHERE courseCode = ?`,
        [title, credits, description, semester, courseCode],
        function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: err.message });
            }

            res.json({
                message: 'Course updated',
                rowsUpdated: this.changes
            });
        }
    );
});

// =====================
// DELETE course
// =====================
app.delete('/api/courses/:courseCode', (req, res) => {
    const courseCode = req.params.courseCode;

    db.run(
        `DELETE FROM courses WHERE courseCode = ?`,
        [courseCode],
        function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: err.message });
            }

            res.json({
                message: 'Course deleted',
                rowsDeleted: this.changes
            });
        }
    );
});

// =====================
// START SERVER
// =====================
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000/api/courses");
});