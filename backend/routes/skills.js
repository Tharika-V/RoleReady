const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// ADD A SKILL
router.post("/", verifyToken, async (req, res) => {
    try {
        const { skill_name, proficiency } = req.body;

        if (!skill_name || !skill_name.trim() || !proficiency) {
            return res.status(400).json({
                message: "Please provide skill name and proficiency."
            });
        }

        const allowedLevels = ["Beginner", "Intermediate", "Advanced"];

        if (!allowedLevels.includes(proficiency)) {
            return res.status(400).json({
                message: "Invalid proficiency level."
            });
        }

        const [existingSkills] = await db.execute(
            `SELECT id FROM skills
             WHERE user_id = ? AND LOWER(skill_name) = LOWER(?)`,
            [req.user.id, skill_name.trim()]
        );

        if (existingSkills.length > 0) {
            return res.status(409).json({
                message: "This skill has already been added."
            });
        }

        await db.execute(
            "INSERT INTO skills (user_id, skill_name, proficiency) VALUES (?, ?, ?)",
            [req.user.id, skill_name.trim(), proficiency]
        );

        res.status(201).json({
            message: "Skill added successfully!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to add skill."
        });
    }
});

// GET ALL STUDENT SKILLS
router.get("/", verifyToken, async (req, res) => {
    try {
        const [skills] = await db.execute(
            "SELECT id, skill_name, proficiency FROM skills WHERE user_id = ?",
            [req.user.id]
        );

        res.json(skills);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch skills."
        });
    }
});

// EDIT A SKILL
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const { skill_name, proficiency } = req.body;

        if (!skill_name || !skill_name.trim() || !proficiency) {
            return res.status(400).json({
                message: "Please provide skill name and proficiency."
            });
        }

        const allowedLevels = ["Beginner", "Intermediate", "Advanced"];

        if (!allowedLevels.includes(proficiency)) {
            return res.status(400).json({
                message: "Invalid proficiency level."
            });
        }

        const [existingSkills] = await db.execute(
            `SELECT id FROM skills
             WHERE user_id = ?
             AND LOWER(skill_name) = LOWER(?)
             AND id <> ?`,
            [req.user.id, skill_name.trim(), req.params.id]
        );

        if (existingSkills.length > 0) {
            return res.status(409).json({
                message: "Another skill with this name already exists."
            });
        }

        const [result] = await db.execute(
            `UPDATE skills
             SET skill_name = ?, proficiency = ?
             WHERE id = ? AND user_id = ?`,
            [skill_name.trim(), proficiency, req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Skill not found."
            });
        }

        res.json({
            message: "Skill updated successfully!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update skill."
        });
    }
});

// DELETE A SKILL
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const [result] = await db.execute(
            "DELETE FROM skills WHERE id = ? AND user_id = ?",
            [req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Skill not found."
            });
        }

        res.json({
            message: "Skill deleted successfully!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete skill."
        });
    }
});

module.exports = router;