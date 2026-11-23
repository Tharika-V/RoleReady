const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// SAVE AN INTERNSHIP
router.post("/", verifyToken, async (req, res) => {
    const connection = await db.getConnection();

    try {
        const {
            title,
            company,
            description,
            match_percentage,
            matchedSkills,
            missingSkills
        } = req.body;

        if (!description) {
            return res.status(400).json({
                message: "Internship description is required."
            });
        }

        await connection.beginTransaction();

        const [result] = await connection.execute(
            `INSERT INTO internships
            (user_id, title, company, description, match_percentage)
            VALUES (?, ?, ?, ?, ?)`,
            [
                req.user.id,
                title || "Internship Opportunity",
                company || null,
                description,
                match_percentage || 0
            ]
        );

        const internshipId = result.insertId;

        const allSkills = [
            ...(matchedSkills || []).map(skill => ({
                name: skill,
                matched: true
            })),
            ...(missingSkills || []).map(skill => ({
                name: skill,
                matched: false
            }))
        ];

        for (const skill of allSkills) {
            await connection.execute(
                `INSERT INTO internship_skills
                (internship_id, skill_name, is_matched)
                VALUES (?, ?, ?)`,
                [internshipId, skill.name, skill.matched]
            );
        }

        await connection.commit();

        res.status(201).json({
            message: "Internship saved successfully!",
            id: internshipId
        });

    } catch (error) {
        await connection.rollback();
        console.error(error);

        res.status(500).json({
            message: "Failed to save internship."
        });

    } finally {
        connection.release();
    }
});

// GET SAVED INTERNSHIPS
router.get("/", verifyToken, async (req, res) => {
    try {
        const [internships] = await db.execute(
            `SELECT * FROM internships
            WHERE user_id = ?
            ORDER BY created_at DESC`,
            [req.user.id]
        );

        for (const internship of internships) {
            const [skills] = await db.execute(
                `SELECT skill_name, is_matched
                FROM internship_skills
                WHERE internship_id = ?`,
                [internship.id]
            );

            internship.matchedSkills = skills
                .filter(skill => skill.is_matched)
                .map(skill => skill.skill_name);

            internship.missingSkills = skills
                .filter(skill => !skill.is_matched)
                .map(skill => skill.skill_name);
        }

        res.json(internships);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch internships."
        });
    }
});
// UPDATE INTERNSHIP APPLICATION STATUS
router.patch("/:id/status", verifyToken, async (req, res) => {
    console.log("DEADLINE ROUTE REACHED");
    try {
        const { application_status } = req.body;

        const allowedStatuses = [
            "Saved",
            "Applied",
            "Under Review",
            "Shortlisted",
            "Rejected",
            "Selected"
        ];

        if (!allowedStatuses.includes(application_status)) {
            return res.status(400).json({
                message: "Invalid application status."
            });
        }

        const [result] = await db.execute(
            `UPDATE internships
             SET application_status = ?
             WHERE id = ? AND user_id = ?`,
            [application_status, req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Internship not found."
            });
        }

        res.json({
            message: "Application status updated successfully!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update application status."
        });
    }
});
// UPDATE INTERNSHIP APPLICATION DEADLINE
router.patch("/:id/deadline", verifyToken, async (req, res) => {
    try {
        const { application_deadline } = req.body;

        if (
            application_deadline &&
            !/^\d{4}-\d{2}-\d{2}$/.test(application_deadline)
        ) {
            return res.status(400).json({
                message: "Invalid deadline format."
            });
        }

        const [result] = await db.execute(
            `UPDATE internships
             SET application_deadline = ?
             WHERE id = ? AND user_id = ?`,
            [
                application_deadline || null,
                req.params.id,
                req.user.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Internship not found."
            });
        }

        res.json({
            message: "Application deadline updated successfully!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update application deadline."
        });
    }
});
// DELETE A SAVED INTERNSHIP
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const [result] = await db.execute(
            `DELETE FROM internships
            WHERE id = ? AND user_id = ?`,
            [req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Internship not found."
            });
        }

        res.json({
            message: "Internship deleted successfully!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete internship."
        });
    }
});

module.exports = router;