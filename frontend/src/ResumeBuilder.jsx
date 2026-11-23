import { useState, useEffect } from 'react';
import './ResumeBuilder.css';

function ResumeBuilder({ skills = [], evidenceList = [], userProfile = null }) {
  console.log("RESUME EVIDENCE DATA:", evidenceList);
  const [profile, setProfile] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    phone: '',
    location: '',
    github: '',
    linkedin: '',
    objective: '',
    degree: '',
    college: '',
    graduationYear: '',
    cgpa: '',
    experience: ''
  });
  useEffect(() => {
    setProfile(prev => ({
      ...prev,
      name: userProfile?.name || '',
      email: userProfile?.email || ''
    }));
  }, [userProfile]);
function generateProfessionalSummary() {
  if (skills.length === 0) {
    return 'Add your technical skills in RoleReady to generate your professional summary automatically.';
  }

  const advanced = skills
    .filter(item => item.level === 'Advanced')
    .map(item => item.name);

  const intermediate = skills
    .filter(item => item.level === 'Intermediate')
    .map(item => item.name);

  const beginner = skills
    .filter(item => item.level === 'Beginner')
    .map(item => item.name);

  let summary = 'Computer Science student with ';

  if (advanced.length > 0) {
    summary += `advanced knowledge of ${advanced.join(', ')}`;
  }

  if (intermediate.length > 0) {
    summary += advanced.length > 0
      ? `, and working knowledge of ${intermediate.join(', ')}`
      : `working knowledge of ${intermediate.join(', ')}`;
  }

  if (beginner.length > 0) {
    summary += advanced.length > 0 || intermediate.length > 0
      ? `, along with foundational knowledge of ${beginner.join(', ')}`
      : `foundational knowledge of ${beginner.join(', ')}`;
  }

  return summary + '. Interested in applying technical skills to practical projects and software development opportunities.';
}
  function handleChange(e) {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  }

  function downloadResume() {
  const resumeElement = document.getElementById('resume-preview');

  if (!resumeElement) {
    alert('Resume preview not found.');
    return;
  }

  const printWindow = window.open('', '_blank');

  if (!printWindow) {
    alert('Please allow pop-ups for RoleReady and try again.');
    return;
  }

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>My Resume</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
            background: white;
            color: #111827;
            font-family: Arial, sans-serif;
          }

          .resume-paper {
            width: 100%;
            min-height: auto;
            padding: 10px;
            background: white;
            color: #111827;
            overflow-wrap: anywhere;
          }

          .resume-paper h1 {
            color: #172554;
            font-size: 26px;
            margin-bottom: 8px;
          }

          .resume-paper h3 {
            color: #1e3a8a;
            font-size: 14px;
            margin-top: 22px;
            padding-bottom: 6px;
            border-bottom: 1px solid #94a3b8;
          }

          .resume-paper p,
          .resume-paper li,
          .resume-paper strong {
            color: #111827;
            font-size: 13px;
            line-height: 1.7;
          }

          .resume-paper ul {
            padding-left: 22px;
          }
        </style>
      </head>
      <body>
        ${resumeElement.innerHTML.replace(
          /<script\b[^>]*>[\s\S]*?<\/script>/gi,
          ''
        )}
      </body>
    </html>
  `);

  printWindow.document.close();
}

  return (
    <div className="resume-builder">
      <div className="resume-heading">
        <span>CAREER TOOLS</span>
        <h2>Resume Builder</h2>
        <p>Create a professional, internship-ready resume.</p>
      </div>

      <div className="resume-layout">

        <div className="resume-editor dashboard-card">
          <h3>Personal & Education Details</h3>

          <input name="name" placeholder="Full Name"
            value={profile.name} onChange={handleChange} />

          <input name="email" type="email" placeholder="Email Address"
            value={profile.email} onChange={handleChange} />

          <input name="phone" placeholder="Phone Number"
            value={profile.phone} onChange={handleChange} />

          <input name="location" placeholder="Location"
            value={profile.location} onChange={handleChange} />
            <input
  name="github"
  placeholder="GitHub Profile URL"
  value={profile.github}
  onChange={handleChange}
/>

<input
  name="linkedin"
  placeholder="LinkedIn Profile URL"
  value={profile.linkedin}
  onChange={handleChange}
/>

          <h3>Career Objective</h3>
          <textarea name="objective"
            placeholder="Write a short professional objective..."
            value={profile.objective} onChange={handleChange} />

          <h3>Education</h3>

          <input name="degree" placeholder="Degree / Course"
            value={profile.degree} onChange={handleChange} />

          <input name="college" placeholder="College Name"
            value={profile.college} onChange={handleChange} />

          <input name="graduationYear" placeholder="Graduation Year"
            value={profile.graduationYear} onChange={handleChange} />

          <input name="cgpa" placeholder="CGPA (optional)"
            value={profile.cgpa} onChange={handleChange} />

          <h3>Experience (Optional)</h3>
          <textarea name="experience"
            placeholder="Add internship or work experience..."
            value={profile.experience} onChange={handleChange} />
        </div>

        <div className="resume-preview" id="resume-preview">
          <div className="resume-paper">

            <h1>{profile.name || 'Your Name'}</h1>

            <p>
             {[
  profile.email,
  profile.phone,
  profile.location,
  profile.github,
  profile.linkedin
]
  .filter(Boolean)
  .join(' | ') || 'Contact information'}
            </p>

            <hr />

            <h3>CAREER OBJECTIVE</h3>
            <p>{profile.objective.trim() || generateProfessionalSummary()}</p>
            <h3>EDUCATION</h3>
            <strong>{profile.degree || 'Your Degree'}</strong>
            <p>{profile.college || 'College Name'}</p>
            <p>
              {profile.graduationYear}
              {profile.cgpa ? ` | CGPA: ${profile.cgpa}` : ''}
            </p>

            <h3>TECHNICAL SKILLS</h3>
{skills.length === 0 ? (
  <p>Add skills in RoleReady to display them here.</p>
) : (
  <ul>
    {skills.map(item => (
  <li key={item.id}>
    <strong>{item.name}</strong> — {item.level}
  </li>
))}
  </ul>
)}

         <h3>PROJECTS & CERTIFICATIONS</h3>

{evidenceList.length === 0 ? (
  <p>Your saved evidence will appear here.</p>
) : (
  evidenceList.map(item => (
    <div key={item.id} className="resume-project">

      <strong>{item.title}</strong>

      <p>
        {item.evidence_type} | {item.skill_name}
      </p>

      {item.description && (
        <p>{item.description}</p>
      )}

      {item.technologies && (
        <p>
          <strong>Technologies:</strong> {item.technologies}
        </p>
      )}

      {item.contribution && (
        <p>
          <strong>Contribution:</strong> {item.contribution}
        </p>
      )}

      {item.issuer && (
        <p>
          <strong>Issued by:</strong> {item.issuer}
        </p>
      )}

      {item.completion_date && (
        <p>
          <strong>Completion date:</strong>{' '}
          {String(item.completion_date).slice(0, 10)}
        </p>
      )}

      {item.url && (
        <p>
          <strong>Link:</strong> {item.url}
        </p>
      )}

    </div>
  ))
)}   

            <h3>EXPERIENCE</h3>
            <p>{profile.experience || 'Add experience if applicable.'}</p>

          </div>
        </div>

      </div>

      <button className="resume-download" onClick={downloadResume}>
        Download / Print Resume
      </button>
    </div>
  );
}

export default ResumeBuilder;