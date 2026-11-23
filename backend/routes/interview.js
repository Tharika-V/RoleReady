const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL INTERVIEW QUESTIONS WITH USER PROGRESS
router.get("/", verifyToken, async (req, res) => {
    try {
        const [questions] = await db.execute(
            `SELECT
                q.id,
                q.category,
                q.topic,
                q.question,
                q.suggested_answer,
                q.difficulty,
                COALESCE(p.status, 'Not Started') AS status,
                COALESCE(p.is_saved, 0) AS is_saved
            FROM interview_questions q
            LEFT JOIN interview_progress p
                ON q.id = p.question_id
                AND p.user_id = ?
            ORDER BY q.category, q.topic, q.id`,
            [req.user.id]
        );

        res.json(questions);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch interview questions."
        });
    }
});

// UPDATE QUESTION PROGRESS AND BOOKMARK
router.patch("/:id/progress", verifyToken, async (req, res) => {
    try {
        const { status, is_saved } = req.body;

        const allowedStatuses = [
            "Not Started",
            "Attempted",
            "Completed"
        ];

        if (
            status !== undefined &&
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                message: "Invalid interview progress status."
            });
        }

        if (
            is_saved !== undefined &&
            typeof is_saved !== "boolean"
        ) {
            return res.status(400).json({
                message: "Invalid bookmark value."
            });
        }

        if (status === undefined && is_saved === undefined) {
            return res.status(400).json({
                message: "No progress details provided."
            });
        }

        const [existing] = await db.execute(
            `SELECT id FROM interview_questions WHERE id = ?`,
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                message: "Interview question not found."
            });
        }

        await db.execute(
            `INSERT INTO interview_progress
                (user_id, question_id, status, is_saved)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                status = COALESCE(?, status),
                is_saved = COALESCE(?, is_saved)`,
            [
                req.user.id,
                req.params.id,
                status || "Not Started",
                is_saved ?? false,
                status ?? null,
                is_saved ?? null
            ]
        );

        res.json({
            message: "Interview progress updated successfully."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update interview progress."
        });
    }
});

module.exports = router;