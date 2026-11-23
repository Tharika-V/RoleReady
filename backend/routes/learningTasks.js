const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// ADD A LEARNING TASK
router.post("/", verifyToken, async (req, res) => {
    try {
        const { skill_name, priority, target_date, reminder_time } = req.body;

        if (!skill_name) {
            return res.status(400).json({
                message: "Skill name is required."
            });
        }

        const allowedPriorities = ["High", "Medium", "Low"];

        if (!allowedPriorities.includes(priority)) {
            return res.status(400).json({
                message: "Invalid priority."
            });
        }

        await db.execute(
            `INSERT INTO learning_tasks
            (user_id, skill_name, priority, target_date, reminder_time)
            VALUES (?, ?, ?, ?, ?)`,
            [
                req.user.id,
                skill_name,
                priority,
                target_date || null,
                reminder_time || null
            ]
        );

        res.status(201).json({
            message: "Learning task added successfully!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to add learning task."
        });
    }
});

// GET ALL LEARNING TASKS
router.get("/", verifyToken, async (req, res) => {
    try {
        const [tasks] = await db.execute(
            `SELECT * FROM learning_tasks
            WHERE user_id = ?
            ORDER BY created_at DESC`,
            [req.user.id]
        );

        res.json(tasks);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch learning tasks."
        });
    }
});

// UPDATE TASK DETAILS
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const {
            skill_name,
            priority,
            target_date,
            reminder_time
        } = req.body;

        if (!skill_name || !skill_name.trim()) {
            return res.status(400).json({
                message: "Skill name is required."
            });
        }

        const allowedPriorities = ["High", "Medium", "Low"];

        if (!allowedPriorities.includes(priority)) {
            return res.status(400).json({
                message: "Invalid priority."
            });
        }

        const [result] = await db.execute(
            `UPDATE learning_tasks
            SET skill_name = ?,
                priority = ?,
                target_date = ?,
                reminder_time = ?
            WHERE id = ? AND user_id = ?`,
            [
                skill_name.trim(),
                priority,
                target_date || null,
                reminder_time || null,
                req.params.id,
                req.user.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.json({
            message: "Learning task edited successfully!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to edit learning task."
        });
    }
});

// UPDATE TASK STATUS
router.patch("/:id", verifyToken, async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Not Started",
            "In Progress",
            "Completed"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid task status."
            });
        }

        const [result] = await db.execute(
            `UPDATE learning_tasks
            SET status = ?
            WHERE id = ? AND user_id = ?`,
            [status, req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.json({
            message: "Task updated successfully!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update task."
        });
    }
});

// DELETE A LEARNING TASK
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const [result] = await db.execute(
            `DELETE FROM learning_tasks
            WHERE id = ? AND user_id = ?`,
            [req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.json({
            message: "Task deleted successfully!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete task."
        });
    }
});

module.exports = router;