import TaskStatusChart from './TaskStatusChart';
import ProgressCharts from './ProgressCharts';
import { useState, useEffect } from 'react';
import { apiRequest } from './api';
import './App.css';
import ResumeBuilder from './ResumeBuilder';
import InternshipDiscovery from './InternshipDiscovery';
import InterviewPreparation from './InterviewPreparation';
function formatDateForInput(value) {
  if (!value) return '';

  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/);

  return match ? match[1] : '';
}
const preparationChecklist = [
  'Update resume',
  'Review required technical skills',
  'Prepare self-introduction',
  'Practise technical interview questions',
  'Prepare HR interview questions',
  'Research the company',
  'Submit application'
];
function App() {
  const [started, setStarted] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [token, setToken] = useState('');
  const [userProfile, setUserProfile] = useState(null);
const [authMode, setAuthMode] = useState('login');
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [authError, setAuthError] = useState('');
  const [skill, setSkill] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [skills, setSkills] = useState([]);
  async function fetchSkills() {
  try {
    const data = await apiRequest('/skills', 'GET', null, token);

    setSkills(
      data.map(item => ({
        id: item.id,
        name: item.skill_name,
        level: item.proficiency
      }))
    );
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    alert(error.message);
  }
}
async function fetchInternships() {
  try {
    const data = await apiRequest(
      '/internships',
      'GET',
      null,
      token
    );

    setSavedInternships(data);
  } catch (error) {
    console.error(error.message);
  }
}

async function fetchLearningTasks() {
  try {
    const data = await apiRequest(
      '/learning-tasks',
      'GET',
      null,
      token
    );

    setLearningTasks(data);
  } catch (error) {
    console.error(error.message);
  }
}

async function fetchEvidence() {
  try {
    const data = await apiRequest(
      '/evidence',
      'GET',
      null,
      token
    );

    setEvidenceList(data);
  } catch (error) {
    console.error(error.message);
  }
}

async function addLearningTask() {
  if (!newTaskSkill.trim()) {
    return;
  }

  try {
    await apiRequest(
      '/learning-tasks',
      'POST',
      {
        skill_name: newTaskSkill,
        priority: taskPriority,
        target_date: taskDate || null,
        reminder_time: taskReminderTime || null
      },
      token
    );

    setNewTaskSkill('');
    setTaskPriority('Medium');
    setTaskDate('');
    setTaskReminderTime('');

    await fetchLearningTasks();
  } catch (error) {
    console.error(error.message);
  }
}

async function editLearningTask(task) {
  const skill_name = prompt("Enter skill name:", task.skill_name);
  if (skill_name === null) return;

  const priority = prompt(
    "Enter priority (High, Medium, Low):",
    task.priority
  );
  if (priority === null) return;

  const target_date = prompt(
    "Enter target date (YYYY-MM-DD):",
    task.target_date ? String(task.target_date).slice(0, 10) : ""
  );
  if (target_date === null) return;

  const reminder_time = prompt(
    "Enter reminder time (HH:MM):",
    task.reminder_time ? String(task.reminder_time).slice(0, 5) : ""
  );
  if (reminder_time === null) return;

  if (!skill_name.trim()) {
    alert("Skill name is required.");
    return;
  }

  if (!["High", "Medium", "Low"].includes(priority)) {
    alert("Please enter High, Medium, or Low as priority.");
    return;
  }

  try {
    await apiRequest(
      `/learning-tasks/${task.id}`,
      "PUT",
      {
        skill_name,
        priority,
        target_date: target_date || null,
        reminder_time: reminder_time || null
      },
      token
    );

    alert("Learning task edited successfully!");
    await fetchLearningTasks();

  } catch (error) {
    alert(error.message);
  }
}

async function deleteLearningTask(id) {
  try {
    await apiRequest(
      `/learning-tasks/${id}`,
      'DELETE',
      null,
      token
    );

    await fetchLearningTasks();
  } catch (error) {
    console.error(error.message);
  }
}

async function addEvidence() {
  if (!evidenceSkill.trim() || !evidenceTitle.trim()) {
    alert('Please enter the skill name and title.');
    return;
  }

  if (
    evidenceType === 'Project' &&
    (!evidenceDescription.trim() ||
      !evidenceTechnologies.trim() ||
      !evidenceContribution.trim())
  ) {
    alert('Please complete the project description, technologies and contribution.');
    return;
  }

  if (evidenceType === 'Certificate' && !evidenceIssuer.trim()) {
    alert('Please enter the issuing organisation.');
    return;
  }

  try {
    await apiRequest(
      '/evidence',
      'POST',
      {
        skill_name: evidenceSkill.trim(),
        evidence_type: evidenceType,
        title: evidenceTitle.trim(),
        url: evidenceUrl || null,
        description: evidenceDescription || null,
        technologies: evidenceTechnologies || null,
        contribution: evidenceContribution || null,
        issuer: evidenceIssuer || null,
        completion_date: evidenceCompletionDate || null
      },
      token
    );

    setEvidenceSkill('');
    setEvidenceType('Project');
    setEvidenceTitle('');
    setEvidenceUrl('');
    setEvidenceDescription('');
    setEvidenceTechnologies('');
    setEvidenceContribution('');
    setEvidenceIssuer('');
    setEvidenceCompletionDate('');

    await fetchEvidence();
  } catch (error) {
    console.error(error.message);
    alert(error.message);
  }
}

async function deleteEvidence(id) {
  try {
    await apiRequest(
      `/evidence/${id}`,
      'DELETE',
      null,
      token
    );

    await fetchEvidence();
  } catch (error) {
    console.error(error.message);
  }
}
useEffect(() => {
  const savedToken = localStorage.getItem('token');
  const savedProfile = localStorage.getItem('userProfile');

  if (savedToken) {
    setToken(savedToken);
    setStarted(true);
  }

  if (savedProfile) {
    setUserProfile(JSON.parse(savedProfile));
  }
}, []);
useEffect(() => {
  if (token && started) {
    fetchSkills();
    fetchInternships();
    fetchLearningTasks();
    fetchEvidence();
  }
}, [token, started]);
const [jobDescription, setJobDescription] = useState('');
const [internshipTitle, setInternshipTitle] = useState('');
const [internshipCompany, setInternshipCompany] = useState('');
const [analysis, setAnalysis] = useState(null);
const [savedInternships, setSavedInternships] = useState([]);
const [selectedPreparationInternship, setSelectedPreparationInternship] = useState('');
const [checklistProgress, setChecklistProgress] = useState(() => {
  return JSON.parse(
    localStorage.getItem('checklistProgress') || '{}'
  );
});

useEffect(() => {
  localStorage.setItem(
    'checklistProgress',
    JSON.stringify(checklistProgress)
  );
}, [checklistProgress]);
const [internshipSearch, setInternshipSearch] = useState('');
const [statusFilter, setStatusFilter] = useState('All');
const [learningTasks, setLearningTasks] = useState([]);
const [evidenceList, setEvidenceList] = useState([]);
const [evidenceSkill, setEvidenceSkill] = useState('');
const [evidenceType, setEvidenceType] = useState('Project');
const [evidenceTitle, setEvidenceTitle] = useState('');
const [evidenceUrl, setEvidenceUrl] = useState('');
const [newTaskSkill, setNewTaskSkill] = useState('');
const [evidenceDescription, setEvidenceDescription] = useState('');
const [evidenceTechnologies, setEvidenceTechnologies] = useState('');
const [evidenceContribution, setEvidenceContribution] = useState('');
const [evidenceIssuer, setEvidenceIssuer] = useState('');
const [evidenceCompletionDate, setEvidenceCompletionDate] = useState('');
const [taskPriority, setTaskPriority] = useState('Medium');
const [taskDate, setTaskDate] = useState('');
const [taskReminderTime, setTaskReminderTime] = useState('');
const [notificationsEnabled, setNotificationsEnabled] = useState(false);
const [notifiedTasks, setNotifiedTasks] = useState([]);

  async function addSkill() {
  if (skill.trim() === '') {
    alert('Please enter a skill');
    return;
  }

  try {
    await apiRequest(
      '/skills',
      'POST',
      {
        skill_name: skill.trim(),
        proficiency: level
      },
      token
    );

    setSkill('');
    setLevel('Beginner');

    await fetchSkills();


  } catch (error) {
    alert(error.message);
  }
}

  async function deleteSkill(id) {
  try {
    await apiRequest(
      `/skills/${id}`,
      'DELETE',
      null,
      token
    );

    await fetchSkills();


  } catch (error) {
    alert(error.message);
  }
}
async function editSkill(skillItem) {
  const skill_name = prompt(
    "Enter skill name:",
    skillItem.name
  );

  if (skill_name === null) return;

  const proficiency = prompt(
    "Enter proficiency (Beginner, Intermediate, Advanced):",
    skillItem.level
  );

  if (proficiency === null) return;

  if (!skill_name.trim()) {
    alert("Skill name is required.");
    return;
  }

  if (!["Beginner", "Intermediate", "Advanced"].includes(proficiency)) {
    alert("Please enter Beginner, Intermediate, or Advanced.");
    return;
  }

  try {
    await apiRequest(
      `/skills/${skillItem.id}`,
      "PUT",
      {
        skill_name,
        proficiency
      },
      token
    );

    alert("Skill updated successfully!");
    await fetchSkills();

  } catch (error) {
    alert(error.message);
  }
}
function analyzeInternship() {
  if (jobDescription.trim() === '') {
    alert('Please paste an internship description');
    return;
  }

  const skillDictionary = [
    'python',
    'java',
    'c',
    'html',
    'css',
    'javascript',
    'react',
    'node.js',
    'mysql',
    'mongodb',
    'machine learning',
    'data analysis',
    'sql',
    'git'
  ];

  const description = jobDescription.toLowerCase();

const requiredSkills = skillDictionary.filter(skill => {
  const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`\\b${escapedSkill}\\b`, 'i');
  return pattern.test(description);
});

  const matchedSkills = requiredSkills.filter(required =>
    skills.some(item => item.name.toLowerCase() === required)
  );

  const missingSkills = requiredSkills.filter(required =>
    !skills.some(item => item.name.toLowerCase() === required)
  );

  const percentage = requiredSkills.length === 0
    ? 0
    : Math.round(
        (matchedSkills.length / requiredSkills.length) * 100
      );

  setAnalysis({
    requiredSkills,
    matchedSkills,
    missingSkills,
    percentage
  });
}
async function saveInternship() {
  if (!internshipTitle.trim() || !internshipCompany.trim()) {
    alert('Please enter internship title and company name.');
    return;
  }

  if (!analysis) {
    return;
  }

  try {
    await apiRequest(
      '/internships',
      'POST',
      {
  title: internshipTitle.trim(),
  company: internshipCompany.trim(),
  description: jobDescription,
  match_percentage: analysis.percentage,
  matchedSkills: analysis.matchedSkills,
  missingSkills: analysis.missingSkills
},
      token
    );

    await fetchInternships();
    setInternshipTitle('');
setInternshipCompany('');
setJobDescription('');
setAnalysis(null);

  } catch (error) {
    console.error(error);
  }
}
async function deleteInternship(id) {
  try {
    await apiRequest(
      `/internships/${id}`,
      'DELETE',
      null,
      token
    );

    await fetchInternships();

  } catch (error) {
    console.error(error);
  }
}
async function updateInternshipDeadline(id, application_deadline) {
  try {
    await apiRequest(
      `/internships/${id}/deadline`,
      'PATCH',
      {
        application_deadline: application_deadline || null
      },
      token
    );

    await fetchInternships();

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}
async function handleAuth() {
  setAuthError('');

  try {
    if (authMode === 'register') {
      await apiRequest('/auth/register', 'POST', {
        name,
        email,
        password
      });

      alert('Registration successful! Please login.');
      setAuthMode('login');
      return;
    }

    const result = await apiRequest('/auth/login', 'POST', {
      email,
      password
    });

    localStorage.setItem('token', result.token);
localStorage.setItem('userProfile', JSON.stringify(result.user));

setToken(result.token);
setUserProfile(result.user);
    setStarted(true);

    alert('Login successful! Welcome to RoleReady.');

  } catch (error) {
    setAuthError(error.message);
  }
}
function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userProfile');
  setToken('');
  setUserProfile(null);
  setStarted(false);
  setShowAuth(false);
  setAuthMode('login');
  setAuthError('');
}
// ENABLE BROWSER NOTIFICATIONS

async function enableNotifications() {
  if (!("Notification" in window)) {
    alert("Your browser does not support notifications.");
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    setNotificationsEnabled(true);
    alert("Notifications enabled successfully!");
  } else {
    setNotificationsEnabled(false);
    alert("Please allow notifications in your browser settings.");
  }
}
// CHECK LEARNING TASK REMINDERS

useEffect(() => {
  if (!notificationsEnabled) return;

  const checkReminders = () => {
    const now = new Date();

    const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    learningTasks.forEach(task => {
      const taskDate = task.target_date
        ? String(task.target_date).slice(0, 10)
        : '';

      const taskTime = task.reminder_time
        ? String(task.reminder_time).slice(0, 5)
        : '';

      if (
        taskDate === currentDate &&
        taskTime === currentTime &&
        task.status !== 'Completed'
      ) {
        setNotifiedTasks(previous => {
          if (previous.includes(task.id)) return previous;

          new Notification('RoleReady Learning Reminder', {
            body: `Time to learn ${task.skill_name}!`
          });

          return [...previous, task.id];
        });
      }
    });
  };

  checkReminders();

  const interval = setInterval(checkReminders, 30000);

  return () => clearInterval(interval);
}, [learningTasks, notificationsEnabled]);
// INTERNSHIP APPLICATION STATISTICS

const totalInternships = savedInternships.length;

const appliedCount = savedInternships.filter(
  item => item.application_status === 'Applied'
).length;

const shortlistedCount = savedInternships.filter(
  item => item.application_status === 'Shortlisted'
).length;

const selectedCount = savedInternships.filter(
  item => item.application_status === 'Selected'
).length;

const rejectedCount = savedInternships.filter(
  item => item.application_status === 'Rejected'
).length;
const totalTasks = learningTasks.length;

const completedTasks = learningTasks.filter(
  task => task.status === 'Completed'
).length;

const inProgressTasks = learningTasks.filter(
  task => task.status === 'In Progress'
).length;

const pendingTasks = learningTasks.filter(
  task => task.status === 'Not Started'
).length;
// UPCOMING AND OVERDUE TASKS

const today = new Date();
const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

const nextWeekString = `${nextWeek.getFullYear()}-${String(nextWeek.getMonth() + 1).padStart(2, '0')}-${String(nextWeek.getDate()).padStart(2, '0')}`;

const upcomingTasks = learningTasks.filter(task => {
  if (!task.target_date || task.status === 'Completed') return false;

  const targetDate = String(task.target_date).slice(0, 10);
  return targetDate >= todayString && targetDate <= nextWeekString;
});

const overdueTasks = learningTasks.filter(task => {
  if (!task.target_date || task.status === 'Completed') return false;

  const targetDate = String(task.target_date).slice(0, 10);
  return targetDate < todayString;
});

const learningProgress = totalTasks === 0
  ? 0
  : Math.round((completedTasks / totalTasks) * 100);

  const skillsWithEvidence = skills.filter(skill =>
  evidenceList.some(
    evidence =>
      evidence.skill_name.toLowerCase() === skill.name.toLowerCase()
  )
);

const skillsWithoutEvidence = skills.filter(skill =>
  !evidenceList.some(
    evidence =>
      evidence.skill_name.toLowerCase() === skill.name.toLowerCase()
  )
);

const evidenceCoverage = skills.length === 0
  ? 0
  : Math.round(
      (skillsWithEvidence.length / skills.length) * 100
    );
    // INTERNSHIP READINESS SCORE

const readinessScore = analysis
  ? Math.round(
      (analysis.percentage * 0.4) +
      (learningProgress * 0.3) +
      (evidenceCoverage * 0.3)
    )
  : null;
  return (
    <div>
      <nav className="main-navbar">
  <div className="navbar-brand">
    <span className="brand-icon">R</span>
    <h2>RoleReady</h2>
  </div>

  <div className="navbar-right">
    <span className="navbar-tagline">
      Your Career Growth Partner
    </span>

    {started && (
      <button className="navbar-logout" onClick={handleLogout}>
        Logout
      </button>
    )}
  </div>
</nav>

      {!started && !showAuth ? (
        <main className="landing-page">
  <section className="hero-section">
    <div className="hero-content">
      <span className="hero-tag">
        YOUR CAREER JOURNEY STARTS HERE
      </span>

      <h1>
        Turn Your Skills Into
        <span className="hero-highlight"> Career Opportunities.</span>
      </h1>

      <p className="hero-description">
        Build your skills, identify what employers are looking for,
        track your learning progress, and become internship-ready
        with one intelligent platform.
      </p>

      <div className="hero-actions">
        <button
          className="hero-primary-button"
          onClick={() => setShowAuth(true)}
        >
          Get Started <span>→</span>
        </button>

        <span className="hero-note">
          Start building your career today.
        </span>
      </div>

      <div className="hero-trust">
        <span>✓ Skill gap analysis</span>
        <span>✓ Learning planner</span>
        <span>✓ Internship tracking</span>
      </div>
    </div>

    <div className="hero-visual">
      <div className="hero-visual-card">
        <div className="visual-card-top">
          <span>YOUR CAREER SNAPSHOT</span>
          <span className="visual-status">● ACTIVE</span>
        </div>

        <div className="visual-score">
          <div>
            <span className="visual-label">Skill development</span>
            <h2>Build your potential</h2>
          </div>
          <div className="visual-icon">✦</div>
        </div>

        <div className="visual-progress-item">
          <div>
            <span>Technical Skills</span>
            <strong>85%</strong>
          </div>
          <div className="visual-progress-track">
            <div style={{ width: '85%' }}></div>
          </div>
        </div>

        <div className="visual-progress-item">
          <div>
            <span>Learning Goals</span>
            <strong>70%</strong>
          </div>
          <div className="visual-progress-track">
            <div style={{ width: '70%' }}></div>
          </div>
        </div>

        <div className="visual-progress-item">
          <div>
            <span>Career Preparation</span>
            <strong>90%</strong>
          </div>
          <div className="visual-progress-track">
            <div style={{ width: '90%' }}></div>
          </div>
        </div>

        <div className="visual-bottom">
          <span>One step closer to your goals.</span>
          <span>↗️</span>
        </div>
      </div>

      <div className="hero-floating-card">
        <span>✦</span>
        <div>
          <strong>Keep growing</strong>
          <p>Your next opportunity awaits.</p>
        </div>
      </div>
    </div>
  </section>

  <section className="landing-features">
    <div className="features-heading">
      <span>WHAT YOU CAN DO</span>
      <h2>Everything you need to get internship-ready.</h2>
      <p>A smarter way to understand your strengths and work on your gaps.</p>
    </div>

    <div className="features-grid">
      <div className="feature-card">
        <span>01</span>
        <h3>Skill Management</h3>
        <p>Organise your technical skills and track your proficiency.</p>
      </div>

      <div className="feature-card">
        <span>02</span>
        <h3>Internship Analysis</h3>
        <p>Compare your skills with internship requirements and find gaps.</p>
      </div>

      <div className="feature-card">
        <span>03</span>
        <h3>Learning Planner</h3>
        <p>Set learning goals, deadlines, and reminders to stay consistent.</p>
      </div>

      <div className="feature-card">
        <span>04</span>
        <h3>Evidence Tracking</h3>
        <p>Connect your skills with projects, certificates, and GitHub work.</p>
      </div>
    </div>
  </section>

  <footer className="landing-footer">
    <strong>RoleReady</strong>
    <span>Build skills. Prove growth. Get ready.</span>
    <span>©️ 2026 RoleReady</span>
  </footer>
</main>
      ) : !started && showAuth ? (
  <main>
    <h1>{authMode === 'login' ? 'Student Login' : 'Create Account'}</h1>

    {authMode === 'register' && (
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    )}

    <input
      type="email"
      placeholder="Enter your email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      type="password"
      placeholder="Enter your password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button onClick={handleAuth}>
      {authMode === 'login' ? 'Login' : 'Register'}
    </button>

    {authError && <p style={{ color: 'red' }}>{authError}</p>}

    <p>
      {authMode === 'login'
        ? "Don't have an account?"
        : 'Already have an account?'}
    </p>

    <button
      onClick={() => {
        setAuthMode(authMode === 'login' ? 'register' : 'login');
        setAuthError('');
      }}
    >
      {authMode === 'login' ? 'Create Account' : 'Login Instead'}
    </button>

    <button onClick={() => setShowAuth(false)}>
      Back
    </button>
  </main>
) : (
  <main className="dashboard-layout">
    <aside className="dashboard-sidebar">
  <div className="sidebar-brand">
    <h2>RoleReady</h2>
    <p>Career Growth Platform</p>
  </div>

  <div className="sidebar-group">
    <span className="sidebar-heading">DASHBOARD</span>
    <a href="#overview">Overview</a>
    <a href="#readiness-score">Readiness Score</a>
  </div>

  <div className="sidebar-group">
    <span className="sidebar-heading">MY CAREER</span>
    <a href="#add-skills">Add Skills</a>
    <a href="#my-skills">My Skills</a>
    <a href="#internship-analysis">Internship Analysis</a>
    <a href="#internship-discovery">Internship Discovery</a>
    <a href="#internship-preparation">Preparation Checklist</a>
  </div>

  <div className="sidebar-group">
    <span className="sidebar-heading">MY LEARNING</span>
    <a href="#learning-planner">Learning Planner</a>
    <a href="#learning-progress">Learning Progress</a>
    <a href="#evidence-tracker">Evidence Tracker</a>
    <a href="#evidence-verification">Evidence Verification</a>
  </div>

  <div className="sidebar-group">
    <span className="sidebar-heading">TOOLS</span>
    <a href="#resume-builder">Resume Builder</a>
  </div>
</aside>
   <div className="dashboard-welcome">
  <div>
    <span className="welcome-tag">YOUR PERSONAL WORKSPACE</span>
    <h1>Welcome back!</h1>
    <p>Let's prepare you for your next internship.</p>
  </div>
  <div className="welcome-icon">✦</div>
</div>
 

          {/* DASHBOARD OVERVIEW */}
<h2 id="overview">Dashboard Overview</h2>

<div className="dashboard-overview">

  <div className="dashboard-card overview card">
    <h3>🧠Total Skills</h3>
    <h2>{skills.length}</h2>
  </div>

  <div className="dashboard-card overview card">
    <h3>💼Saved Internships</h3>
    <h2>{savedInternships.length}</h2>
  </div>

  <div className="dashboard-card overview card">
    <h3>📚Pending Tasks</h3>
    <h2>
      {learningTasks.filter(
        (task) => task.status !== 'Completed'
      ).length}
    </h2>
  </div>

  <div className="dashboard-card overview card">
    <h3>🏆Evidence Uploaded</h3>
    <h2>{evidenceList.length}</h2>
  </div>

</div>
{/* END DASHBOARD OVERVIEW */}
{/* APPLICATION STATISTICS */}
<div className="application-statistics" id="application-statics">
  <h2>📊 Application Statistics</h2>

  <div className="dashboard-overview">

    <div className="dashboard-card overview card">
      <h3>Total Applications</h3>
      <h2>{totalInternships}</h2>
    </div>

    <div className="dashboard-card overview card">
      <h3>📨 Applied</h3>
      <h2>{appliedCount}</h2>
    </div>

    <div className="dashboard-card overview card">
      <h3>⭐ Shortlisted</h3>
      <h2>{shortlistedCount}</h2>
    </div>

    <div className="dashboard-card overview card">
      <h3>🎉 Selected</h3>
      <h2>{selectedCount}</h2>
    </div>

    <div className="dashboard-card overview card">
      <h3>❌ Rejected</h3>
      <h2>{rejectedCount}</h2>
    </div>

  </div>
</div>
{/* END APPLICATION STATISTICS */}
<div className="dashboard-card" style={{ margin: '30px 0' }}>
    <h2>💼 Saved Internships</h2>

    {savedInternships.length === 0 ? (
        <p>No internships saved yet.</p>
    ) : (
        <div className="task-list">
            {savedInternships.map((internship) => (
<div className="dashboard-card saved-internship-item" key={internship.id}>
                    <h3>{internship.title}</h3>

                    <p>
                        Company: {internship.company || "Not specified"}
                    </p>

                    <p>
                        Match Percentage: {internship.match_percentage}%
                    </p>

                    <p>Application Status:</p>

                    <select
                        value={internship.application_status || "Saved"}
                        onChange={(e) =>
                            updateInternshipStatus(
                                internship.id,
                                e.target.value
                            )
                        }
                    >
                        <option value="Saved">Saved</option>
                        <option value="Applied">Applied</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Selected">Selected</option>
                    </select>
                  <p>Application Deadline:</p>

<input
  type="date"
  value={
    internship.application_deadline
      ? String(internship.application_deadline).slice(0, 10)
      : ''
  }
  onChange={(e) =>
    updateInternshipDeadline(internship.id, e.target.value)
  }
/>

{internship.application_deadline && (() => {
  const deadline = new Date(
    String(internship.application_deadline).slice(0, 10) + 'T00:00:00'
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysLeft = Math.round(
    (deadline - today) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft < 0) {
    return <p style={{ color: '#dc2626', fontWeight: 'bold' }}>
      ⚠️ Application deadline has passed!
    </p>;
  }

  if (daysLeft === 0) {
    return <p style={{ color: '#dc2626', fontWeight: 'bold' }}>
      🔔 Deadline is today!
    </p>;
  }

  return (
  <p style={{ color: '#d97706', fontWeight: 'bold' }}>
    ⏰ {daysLeft} days left!
  </p>
);
})()}

                    <button
                        onClick={() => deleteInternship(internship.id)}
                    >
                        Delete Internship
                    </button>

                </div>
            ))}
        </div>
    )}
</div>
{/* INTERNSHIP PREPARATION */}
<h2 id="internship-preparation">Internship Preparation</h2>

<div className="dashboard-card">
  <label>Select Internship</label>

  <select
    value={selectedPreparationInternship}
    onChange={(e) => setSelectedPreparationInternship(e.target.value)}
  >
    <option value="">Choose a saved internship</option>

    {savedInternships.map(internship => (
      <option key={internship.id} value={String(internship.id)}>
        {internship.title} - {internship.company}
      </option>
    ))}
  </select>

  {selectedPreparationInternship && (
    <div className="preparation-checklist">
      <h3>📋 Preparation Checklist</h3>

      <p>
        Progress: {(checklistProgress[selectedPreparationInternship] || []).length}
        /{preparationChecklist.length} completed
      </p>

      {preparationChecklist.map((item, index) => (
        <label key={index}>
          <input
            type="checkbox"
            checked={(checklistProgress[selectedPreparationInternship] || []).includes(index)}
            onChange={() => {
              setChecklistProgress(previous => {
                const current = previous[selectedPreparationInternship] || [];

                const updated = current.includes(index)
                  ? current.filter(value => value !== index)
                  : [...current, index];

                return {
                  ...previous,
                  [selectedPreparationInternship]: updated
                };
              });
            }}
          />
          {' '}{item}
        </label>
      ))}
    </div>
  )}
</div>
{/* LEARNING PROGRESS DASHBOARD */}

<h2 id="learning-progress">Learning Progress</h2>

<div className="dashboard-overview">

  <div className="dashboard-card">
    <h3>📚 Total Tasks</h3>
    <h2>{totalTasks}</h2>
  </div>

  <div className="dashboard-card">
    <h3>✅ Completed</h3>
    <h2>{completedTasks}</h2>
  </div>

  <div className="dashboard-card">
    <h3>🔄 In Progress</h3>
    <h2>{inProgressTasks}</h2>
  </div>

  <div className="dashboard-card">
    <h3>⏳ Not Started</h3>
    <h2>{pendingTasks}</h2>
  </div>

</div>

<div className="dashboard-card" style={{ margin: '20px 0' }}>
  <h3>Overall Learning Completion</h3>

  <h2>{learningProgress}%</h2>

  <div className="learning-progress-bar">
    <div
      className="learning-progress-fill"
      style={{ width: `${learningProgress}%` }}
    ></div>
  </div>
  <h3>
  {readinessScore >= 80
    ? 'Excellent Readiness'
    : readinessScore >= 60
    ? 'Good Progress'
    : readinessScore >= 40
    ? 'Needs Improvement'
    : 'Keep Learning'}
</h3>

<p>
  {readinessScore >= 80
    ? 'You are showing strong preparation for this internship.'
    : readinessScore >= 60
    ? 'You are making good progress. Improve your remaining skill gaps.'
    : readinessScore >= 40
    ? 'Focus on learning missing skills and adding evidence.'
    : 'Keep building your skills, completing tasks, and adding projects.'}
</p>
</div>

{/* END LEARNING PROGRESS DASHBOARD */}

          <h2 id="add-skills">Add YourSkills</h2>

          <div className="skill-form">
            <input
              type="text"
              placeholder="Enter a skill (e.g. Python)"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>

            <button onClick={addSkill}>
              Add Skill
            </button>
          </div>
          {/* MY SKILLS */}
<h2 id="my-skills">My Skills</h2>

<div className="skill-match-list">
  {skills.length === 0 ? (
    <p>No skills added yet.</p>
  ) : (
    skills.map((item) => (
      <div className="dashboard-card" key={item.id}>
        <h3>{item.name}</h3>
        <p>Proficiency: {item.level}</p>

        <button onClick={() => editSkill(item)}>
          Edit Skill
        </button>

        <button onClick={() => deleteSkill(item.id)}>
          Delete Skill
        </button>
      </div>
    ))
  )}
</div>
{/* END MY SKILLS */}
<h2 id="internship-analysis">Analyse Internship</h2>

<p>Paste the internship description below to check your skill match.</p>
<input
  type="text"
  placeholder="Enter internship title (e.g. Data Analyst Intern)"
  value={internshipTitle}
  onChange={(e) => setInternshipTitle(e.target.value)}
  style={{
    width: '100%',
    padding: '15px',
    marginTop: '15px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    boxSizing: 'border-box'
  }}
/>

<input
  type="text"
  placeholder="Enter company name"
  value={internshipCompany}
  onChange={(e) => setInternshipCompany(e.target.value)}
  style={{
    width: '100%',
    padding: '15px',
    marginTop: '12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    boxSizing: 'border-box'
  }}
/>
<textarea
  placeholder="Paste internship description here..."
  value={jobDescription}
  onChange={(e) => setJobDescription(e.target.value)}
  rows="6"
  style={{
    width: '100%',
    padding: '15px',
    marginTop: '15px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '15px'
  }}
/>

<br /><br />

<button onClick={analyzeInternship}>
  Analyse My Skills
</button>
<br /><br />

<button
  onClick={saveInternship}>
  Save Internship
</button>
{analysis && (
<div className="dashboard-card saved-internships-section" style={{ margin: '30px 0' }}>  <h2>Internship Analysis Results</h2>

  <h1>{analysis.percentage}% Match</h1>

  <h3>Required Skills</h3>

  <div className="skill-match-list">
    {analysis.requiredSkills.length === 0 ? (
      <p>No recognised skills found.</p>
    ) : (
      analysis.requiredSkills.map((skill) => {
        const matchedSkill = skills.find(
          item => item.name.toLowerCase() === skill.toLowerCase()
        );

        return (
          <div className="skill-match-item" key={skill}>
            <span>{skill}</span>

            {matchedSkill ? (
  <span className="matched-status">
    Matched - {matchedSkill.level}
  </span>
) : (
  <span className="missing-status">
    Missing
  </span>
)}
          </div>
        );
      })
    )}
 {/* SAVED INTERNSHIPS */}

 </div>
</div>
)}
{/* INTERNSHIP READINESS SCORE */}

{readinessScore !== null && (
  <>
    <h2 id="readiness-score">Internship Readiness Score</h2>

    <div className="dashboard-card" style={{ margin: '20px 0' }}>
      <h3>Your Overall Readiness</h3>

      <h1>{readinessScore}%</h1>

      <p>
        Based on your skill match, learning progress,
        and supporting evidence.
      </p>

      <div className="learning-progress-bar">
        <div
          className="learning-progress-fill"
          style={{ width: `${readinessScore}%` }}
        ></div>
      </div>
    </div>
  </>
)}

{/* END INTERNSHIP READINESS SCORE */}
{analysis && analysis.missingSkills.length > 0 && (
  <div className="dashboard-card" style={{ margin: '20px 0' }}>
    <h2>Recommended Learning Tasks</h2>

    <p>
      Based on your missing skills, here are the skills
      you should focus on learning.
    </p>

    {analysis.missingSkills.map((missingSkill) => (
      <div key={missingSkill} style={{ margin: '15px 0' }}>
        <span>{missingSkill}</span>

        <button
          onClick={() => {
            setNewTaskSkill(missingSkill);
            setTaskPriority('High');
          }}
        >
          Add to Learning Planner
        </button>
      </div>
    ))}
  </div>
)}
  {/* LEARNING PLANNER */}
<div className="learning-planner">
  <h2 id="learning-planner">My Learning Planner</h2>
  <div className="dashboard-charts">
  <ProgressCharts tasks={learningTasks} />
  <TaskStatusChart tasks={learningTasks} />
</div>
  <button onClick={enableNotifications}>
  🔔 Enable Notifications
</button>
    <p>Plan your learning and track your progress.</p>

  {/* UPCOMING TASKS */}

<h3>Upcoming Tasks (Next 7 Days)</h3>

{upcomingTasks.length === 0 ? (
  <p>No upcoming tasks.</p>
) : (
  upcomingTasks.map(task => (
    <div key={task.id}>
      <p>
        {task.skill_name} — Due: {String(task.target_date).slice(0, 10)}
      </p>
    </div>
  ))
)}


  {/* OVERDUE TASKS */}

<h3>Overdue Tasks</h3>

{overdueTasks.length === 0 ? (
  <p>No overdue tasks.</p>
) : (
  overdueTasks.map(task => (
    <div key={task.id}>
      <p>
        {task.skill_name} — Due: {String(task.target_date).slice(0, 10)}
      </p>
    </div>
  ))
)}

  <div className="dashboard-card">
    <h3>Add a Learning Task</h3>

    <input
      type="text"
      placeholder="Enter skill to learn"
      value={newTaskSkill}
      onChange={(e) => setNewTaskSkill(e.target.value)}
    />

    <select
      value={taskPriority}
      onChange={(e) => setTaskPriority(e.target.value)}
    >
      <option value="High">High Priority</option>
      <option value="Medium">Medium Priority</option>
      <option value="Low">Low Priority</option>
    </select>

    <input
      type="date"
      value={taskDate}
      onChange={(e) => setTaskDate(e.target.value)}
    />
    <p>Reminder Time (optional)</p>

<input
  type="time"
  value={taskReminderTime}
  onChange={(e) => setTaskReminderTime(e.target.value)}
/>

    <button onClick={addLearningTask}>
      Add Learning Task
    </button>
  </div>

 <h3>Your Learning Tasks</h3>

{learningTasks.length === 0 ? (
  <p>No learning tasks added yet.</p>
) : (
  <div className="task-list">
    {learningTasks.map((task) => (
      <div className="dashboard-card task-card" key={task.id}>
        <h3>{task.skill_name}</h3>

        <p>Priority: {task.priority}</p>

        <p>
          Target Date: {task.target_date
            ? new Date(task.target_date).toLocaleDateString('en-GB', {
                timeZone: 'UTC',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })
            : "Not set"}
        </p>

        <p>
          Reminder Time: {task.reminder_time
            ? String(task.reminder_time).slice(0, 5)
            : "Not set"}
        </p>

        <select
          value={task.status}
          onChange={(e) =>
            updateTaskStatus(task.id, e.target.value)
          }
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button onClick={() => editLearningTask(task)}>
          Edit Task
        </button>

        <button onClick={() => deleteLearningTask(task.id)}>
          Delete Task
        </button>
      </div>
    ))}
  </div>
)}
</div>
{/* EVIDENCE TRACKER */}
<h2 id="evidence-tracker">My Evidence Tracker</h2>

<div className="dashboard-card">

  <input
    type="text"
    placeholder="Skill name (e.g. Python)"
    value={evidenceSkill}
    onChange={(e) => setEvidenceSkill(e.target.value)}
  />

  <select
    value={evidenceType}
    onChange={(e) => setEvidenceType(e.target.value)}
  >
    <option value="Project">Project</option>
    <option value="Certificate">Certificate</option>
    <option value="GitHub">GitHub</option>
  </select>

  <input
    type="text"
    placeholder="Project or Certificate title"
    value={evidenceTitle}
    onChange={(e) => setEvidenceTitle(e.target.value)}
  />

  {evidenceType === 'Project' && (
    <>
      <textarea
        placeholder="Project description: What does your project do?"
        value={evidenceDescription}
        onChange={(e) => setEvidenceDescription(e.target.value)}
      />

      <input
        type="text"
        placeholder="Technologies used (e.g. React, Node.js, MySQL)"
        value={evidenceTechnologies}
        onChange={(e) => setEvidenceTechnologies(e.target.value)}
      />

      <textarea
        placeholder="Your contribution: What did you develop?"
        value={evidenceContribution}
        onChange={(e) => setEvidenceContribution(e.target.value)}
      />
    </>
  )}

  {evidenceType === 'GitHub' && (
    <>
      <textarea
        placeholder="Repository description"
        value={evidenceDescription}
        onChange={(e) => setEvidenceDescription(e.target.value)}
      />

      <input
        type="text"
        placeholder="Technologies used"
        value={evidenceTechnologies}
        onChange={(e) => setEvidenceTechnologies(e.target.value)}
      />

      <textarea
        placeholder="Your contribution"
        value={evidenceContribution}
        onChange={(e) => setEvidenceContribution(e.target.value)}
      />
    </>
  )}

  {evidenceType === 'Certificate' && (
    <>
      <input
        type="text"
        placeholder="Issuing organisation"
        value={evidenceIssuer}
        onChange={(e) => setEvidenceIssuer(e.target.value)}
      />

      <label>Completion date</label>
      <input
        type="date"
        value={evidenceCompletionDate}
        onChange={(e) => setEvidenceCompletionDate(e.target.value)}
      />
    </>
  )}

  <input
    type="url"
    placeholder="Evidence URL (optional)"
    value={evidenceUrl}
    onChange={(e) => setEvidenceUrl(e.target.value)}
  />

  <button onClick={addEvidence}>
    Add Evidence
  </button>
</div>

{evidenceList.length === 0 ? (
  <p>No evidence added yet.</p>
) : (
  <div className="skill-list">
    {evidenceList.map((item) => (
      <div className="dashboard-card" key={item.id}>
        <h3>{item.title}</h3>
        <p>Skill: {item.skill_name}</p>
        <p>Type: {item.evidence_type}</p>

        {item.description && <p>{item.description}</p>}
        {item.technologies && <p>Technologies: {item.technologies}</p>}
        {item.contribution && <p>Contribution: {item.contribution}</p>}
        {item.issuer && <p>Issued by: {item.issuer}</p>}
        {item.completion_date && <p>Completed: {String(item.completion_date).slice(0, 10)}</p>}

        {item.url && (
          <p>
            <a href={item.url} target="_blank" rel="noreferrer">
              View Evidence
            </a>
          </p>
        )}

        <button onClick={() => deleteEvidence(item.id)}>
          Delete Evidence
        </button>
      </div>
    ))}
  </div>
)}
{/* END EVIDENCE TRACKER */}
{/* EVIDENCE-BASED SKILL VERIFICATION */}

<h2 id="evidence-verification">Skill Evidence Verification</h2>

<div className="dashboard-card" style={{ margin: '20px 0' }}>
  <h3>Evidence Coverage</h3>

  <h1>{evidenceCoverage}%</h1>

  <p>
    {skillsWithEvidence.length} out of {skills.length} skills
    have supporting evidence.
  </p>

  <div className="learning-progress-bar">
    <div
      className="learning-progress-fill"
      style={{ width: `${evidenceCoverage}%` }}
    ></div>
  </div>
</div>

<div className="skill-match-list">
  {skills.length === 0 ? (
    <p>Add skills to check their evidence.</p>
  ) : (
    skills.map((item) => {
      const hasEvidence = evidenceList.some(
        evidence =>
          evidence.skill_name.toLowerCase() ===
          item.name.toLowerCase()
      );

      return (
        <div className="skill-match-item" key={item.id}>
          <span>{item.name}</span>

          {hasEvidence ? (
            <span className="matched-status">
              Evidence Added
            </span>
          ) : (
            <span className="missing-status">
              No Evidence
            </span>
          )}
        </div>
      );
    })
  )}
</div>

{/* END EVIDENCE-BASED SKILL VERIFICATION */}
          <h2 id="my-skills">My Skills</h2>
          {/* RESUME BUILDER */}
<div id="resume-builder">
  <ResumeBuilder
    skills={skills}
    evidenceList={evidenceList}
    userProfile={userProfile}
  />
</div>
{/* INTERNSHIP DISCOVERY */}
<div id="internship-discovery">
  <InternshipDiscovery />
</div>
<InterviewPreparation token={token} />

          {skills.length === 0 ? (
            <p>No skills added yet.</p>
          ) : (
            <div className="skill-list">
              {skills.map((item) => (
                <div className="dashboard-card" key={item.id}>
                  <h3>{item.name}</h3>

                  <p>Level: {item.level}</p>

                   <button onClick={() => deleteSkill(item.id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default App;