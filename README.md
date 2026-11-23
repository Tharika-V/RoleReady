RoleReady – Internship Readiness and Career Preparation Platform

RoleReady is a full-stack web application designed to help students prepare for internships and manage their career development in one place.

The platform helps users track their technical skills, discover internships, identify skill gaps, plan their learning activities, maintain project evidence, build resumes and prepare for interviews.

🎯 Project Objective

The main objective of RoleReady is to provide a centralized platform that helps students understand their internship readiness, improve their technical skills and organize their career preparation journey.

✨ Features

1. Dashboard

- Overview of internship preparation progress.
- Skill development summary.
- Learning progress tracking.
- Internship readiness score.
- Quick access to different platform modules.

2. Skills Management

- Add and manage technical skills.
- Categorize skills into Beginner, Intermediate and Advanced levels.
- Track individual skill development.
- Compare existing skills with internship requirements.

3. Internship Discovery and Skill Matching

- Add internship opportunities.
- Maintain internship details such as company name, title, location and duration.
- Record required skills.
- Compare personal skills with internship requirements.
- View skill match percentage.
- Identify missing skills to improve internship eligibility.
- Track internship application status.

4. Internship Application Tracker

- Maintain internship application records.
- Track application progress and status.
- Organize internship opportunities.
- View application statistics.

5. Internship Readiness Score

RoleReady calculates an overall internship readiness score using three components:

- Skill Match – 40%
- Learning Progress – 30%
- Project and Certificate Evidence – 30%

The score helps users understand their preparation progress and identify areas that need improvement.

6. Learning Planner

- Create personalized learning tasks.
- Set target dates and reminders.
- Track tasks using Not Started, In Progress and Completed statuses.
- Monitor learning progress.
- Edit and manage learning activities.
- Receive browser-based reminders.

7. Evidence Tracker

- Add projects, certificates and GitHub evidence.
- Associate evidence with relevant technical skills.
- Store project titles and supporting links.
- Maintain proof of practical learning and achievements.

8. Resume Builder

- Create a professional resume using career and skill information.
- Include educational and technical information.
- Highlight projects and achievements.
- Present skills and supporting evidence for internship applications.

9. Interview Preparation Hub

- Dedicated interview preparation section.
- Supports preparation for internship interviews.
- Helps users organize their interview preparation activities.

10. User Authentication

- User registration and login.
- Secure password handling.
- Token-based authentication using JWT.
- Protected application features.

🛠️ Technologies Used

Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Vite

Backend

- Node.js
- Express.js
- REST API

Database

- MySQL
- mysql2

Development Tools

- Visual Studio Code
- Git
- GitHub
- MySQL Workbench
- npm

🏗️ Project Architecture

RoleReady follows a frontend–backend architecture.

1. Frontend: React provides the user interface and interactive features.
2. Backend: Node.js and Express handle application logic and API requests.
3. Database: MySQL stores user information, skills, internships, learning tasks and evidence.
4. API Communication: The frontend communicates with the backend through REST API endpoints.

📂 Project Structure

RoleReady/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── skills.js
│   │   ├── internships.js
│   │   ├── learning-tasks.js
│   │   ├── evidence.js
│   │   └── interview.js
│   ├── .env.example
│   └── test-db.js
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── ResumeBuilder.jsx
│   │   └── api.js
│   └── ...
│
├── .gitignore
└── README.md

⚙️ Installation and Setup

Prerequisites

- Node.js and npm
- MySQL Server
- Visual Studio Code

1. Clone the Repository

git clone https://github.com/Tharika-V/RoleReady.git
cd RoleReady

2. Backend Setup

cd backend
npm install

Create a ".env" file in the backend folder and configure the following variables:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=RoleReady
PORT=5001
JWT_SECRET=your_secret_key

Configure your local MySQL database using the project's database schema.

Start the backend using the start script configured in "backend/package.json".

3. Frontend Setup

Open another terminal:

cd frontend
npm install
npm run dev

Open the local URL displayed by Vite in your browser.

Note: The backend and database must be configured and running for the application's full functionality.

🔐 Security

- Environment variables are used for sensitive configuration.
- Actual ".env" files are excluded from version control.
- JWT is used for authentication.
- Database credentials should never be committed to GitHub.

🚀 Future Enhancements

- Live internship portal integration.
- Automated internship recommendations.
- Advanced skill-gap analysis.
- Resume export and download improvements.
- Deployment as a publicly accessible web application.

👩‍💻 Developed By

Tharika V

B.Tech – Computer Science and Engineering
Artificial Intelligence and Data Science

🔗 GitHub Repository

https://github.com/Tharika-V/RoleReady

---

RoleReady – Prepare Your Skills. Track Your Progress. Get Internship Ready.
