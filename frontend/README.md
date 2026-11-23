RoleReady – Internship Readiness & Skill Gap Planner

RoleReady is a full-stack web application designed to help students prepare for internships by identifying skill gaps, tracking learning progress, managing internship applications, and maintaining evidence of their skills.

Features

- User Authentication: Secure registration and login using JWT authentication.
- Skill Management: Add, edit, and delete skills.
- Internship Analysis: Compare existing skills with internship requirements.
- Skill Gap Identification: Identify matched and missing skills.
- Internship Management: Save internships and track application status.
- Learning Planner: Create learning tasks with priorities, target dates, and reminder times.
- Learning Recommendations: Get recommendations based on missing skills.
- Evidence Tracker: Maintain projects, certificates, and GitHub links as skill evidence.
- Readiness Score: Calculate an internship readiness score using skill matching, learning progress, and evidence coverage.
- Dashboard: View important progress information in one place.

Technology Stack

Frontend

- React.js
- Vite
- HTML
- CSS
- JavaScript

Backend

- Node.js
- Express.js
- REST API
- JWT Authentication

Database

- MySQL

Project Structure

RoleReady/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md

Installation and Setup

1. Clone the Repository

cd RoleReady

2. Backend Setup

cd backend
npm install

Create a ".env" file inside the backend folder:

DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=Roleready
JWT_SECRET=your_secret_key
PORT=5001

Replace the example values with your own configuration.

Create the required MySQL database and tables before starting the application.

Start the backend:

node server.js

3. Frontend Setup

Open another terminal:

cd frontend
npm install
npm run dev

Open the local URL displayed in the terminal to access RoleReady.

Application Workflow

1. Register or log in.
2. Add your skills.
3. Analyse an internship to identify matching and missing skills.
4. Save internships and update application statuses.
5. Create learning tasks to improve missing skills.
6. Add projects, certificates, and GitHub links as evidence.
7. Monitor your learning progress and internship readiness score.

Purpose

RoleReady aims to make internship preparation more structured by bringing skill assessment, learning planning, internship tracking, and evidence management together in one platform.

Author

Developed as a Full Stack Development project.