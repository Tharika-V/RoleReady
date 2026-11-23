const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Authentication routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Skills routes
const skillRoutes = require("./routes/skills");
app.use("/api/skills", skillRoutes);

// Internship routes
const internshipRoutes = require("./routes/internships");
app.use("/api/internships", internshipRoutes);

// Learning and evidence routes
const learningTaskRoutes = require("./routes/learningTasks");
const evidenceRoutes = require("./routes/evidence");

app.use("/api/learning-tasks", learningTaskRoutes);
app.use("/api/evidence", evidenceRoutes);

// Interview preparation routes
const interviewRoutes = require("./routes/interview");
app.use("/api/interview", interviewRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("RoleReady Backend is running!");
});

// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`RoleReady server running on port ${PORT}`);
});