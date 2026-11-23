const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// ADD SKILL EVIDENCE
router.post("/", verifyToken, async (req, res) => {
    try {
        const {
            skill_name,
            evidence_type,
            title,
            url,
            description,
            technologies,
            contribution,
            issuer,
            completion_date
        } = req.body;

        if (!skill_name?.trim() || !evidence_type || !title?.trim()) {
            return res.status(400).json({
                message: "Please fill in all required fields."
            });
        }

        const allowedTypes = [
            "Project",
            "Certificate",
            "GitHub"
        ];

        if (!allowedTypes.includes(evidence_type)) {
            return res.status(400).json({
                message: "Invalid evidence type."
            });
        }

        await db.execute(
            `INSERT INTO evidence
            (
                user_id,
                skill_name,
                evidence_type,
                title,
                url,
                description,
                technologies,
                contribution,
                issuer,
                completion_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.user.id,
                skill_name.trim(),
                evidence_type,
                title.trim(),
                url || null,
                description || null,
                technologies || null,
                contribution || null,
                issuer || null,
                completion_date || null
            ]
        );

        res.status(201).json({
            message: "Evidence added successfully!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to add evidence."
        });
    }
});

// GET ALL EVIDENCE
router.get("/", verifyToken, async (req, res) => {
    try {
        const [evidence] = await db.execute(
            `SELECT * FROM evidence
            WHERE user_id = ?
            ORDER BY created_at DESC`,
            [req.user.id]
        );

        res.json(evidence);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch evidence."
        });
    }
});

// DELETE EVIDENCE
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const [result] = await db.execute(
            `DELETE FROM evidence
            WHERE id = ? AND user_id = ?`,
            [req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Evidence not found."
            });
        }

        res.json({
            message: "Evidence deleted successfully!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete evidence."
        });
    }
});

module.exports = router;